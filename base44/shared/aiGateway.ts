import { secrets } from 'base44:runtime';

// Cloudflare AI Gateway for Mercy House. All model traffic goes through the
// "mercyhouse" gateway so usage, caching and rate limits live in one place.
//
// Auth: a Cloudflare API token for account af822065bd416045e3a0e3d07e0648fe,
// held in the app secrets as CLOUDFLARE_API_TOKEN. Provider traffic is billed to
// the gateway's own BYOK key, selected with the `cf-aig-byok-alias` header.
//
// Text + vision run on the Azure deployment `gpt-6-astra` through the gateway's
// OpenAI-compatible endpoint. That model rejects `max_tokens` — it takes
// `max_completion_tokens` instead (see chat()). Images are passed as URLs; it
// does not accept SVG.
//
// Image generation still runs on Workers AI (`@cf/...`), which bills against the
// account's Workers AI allowance rather than gateway credits, so it keeps using
// the account run endpoint (still tagged with the gateway id for logging).
const ACCOUNT_ID = 'af822065bd416045e3a0e3d07e0648fe';
const GATEWAY_ID = 'mercyhouse';
const BYOK_ALIAS = 'foundry';
const CHAT_URL = `https://gateway.ai.cloudflare.com/v1/${ACCOUNT_ID}/${GATEWAY_ID}/compat/chat/completions`;
const RUN_URL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run`;

export const DEFAULT_TEXT_MODEL = 'azure-openai/gpt-6-astra';
export const VISION_MODEL = 'azure-openai/gpt-6-astra';
export const DEFAULT_IMAGE_MODEL = '@cf/black-forest-labs/flux-1-schnell';

function authHeaders(withByok = true) {
  const token = secrets.get('CLOUDFLARE_API_TOKEN');
  if (!token) {
    throw new Error('AI gateway credentials are not configured');
  }
  const headers = {
    'Content-Type': 'application/json',
    'cf-aig-gateway-id': GATEWAY_ID,
    Authorization: `Bearer ${token}`,
  };
  // Workers AI requests must not name a BYOK alias — only provider models use one.
  if (withByok) headers['cf-aig-byok-alias'] = BYOK_ALIAS;
  return headers;
}

async function postJson(url, body, timeoutMs, withByok = true) {
  const response = await fetch(url, {
    method: 'POST',
    headers: authHeaders(withByok),
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
  });
  const raw = await response.text();
  if (!response.ok) {
    throw new Error(`AI gateway ${response.status}: ${raw.slice(0, 300)}`);
  }
  const data = JSON.parse(raw);
  if (data && data.success === false) {
    throw new Error(`AI gateway error: ${JSON.stringify(data.errors).slice(0, 300)}`);
  }
  return data;
}

function readContent(data) {
  const message = data?.choices?.[0]?.message ?? data?.result?.choices?.[0]?.message;
  const content = message?.content;
  if (!content) throw new Error('The AI gateway returned no content');
  if (typeof content === 'string') return content;
  return content.map((part) => part?.text || '').join('');
}

/** Chat completion returning plain text. `messages` uses the OpenAI format. */
export async function chat({ messages, model = DEFAULT_TEXT_MODEL, maxTokens = 1500, timeoutMs = 90000 }) {
  const data = await postJson(
    CHAT_URL,
    { model, messages, max_completion_tokens: maxTokens },
    timeoutMs,
  );
  return readContent(data);
}

/** Turns a prompt plus an optional public image URL into a chat message list. */
export function buildUserMessage(text, imageUrl) {
  if (!imageUrl) return [{ role: 'user', content: text }];
  return [
    {
      role: 'user',
      content: [
        { type: 'text', text },
        { type: 'image_url', image_url: { url: imageUrl } },
      ],
    },
  ];
}

function parseJsonObject(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = (fenced ? fenced[1] : text).trim();
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start === -1 || end === -1) {
    throw new Error('The AI response was not valid JSON');
  }
  return JSON.parse(candidate.slice(start, end + 1));
}

/** Same as chat(), but parses the reply as a JSON object. */
export async function chatJson(options) {
  const text = await chat(options);
  return parseJsonObject(text);
}

/**
 * Text-to-image through the gateway. Returns { base64, contentType } so the
 * caller decides where the bytes get stored.
 */
export async function generateImage({ prompt, model = DEFAULT_IMAGE_MODEL, timeoutMs = 120000 }) {
  const data = await postJson(RUN_URL, { model, input: { prompt } }, timeoutMs, false);

  const result = data?.result ?? data;
  const image = result?.image ?? result?.data?.[0]?.b64_json ?? result?.images?.[0];

  if (!image || typeof image !== 'string') {
    throw new Error('The AI gateway returned no image data');
  }
  return {
    base64: image.replace(/^data:image\/\w+;base64,/, ''),
    contentType: 'image/jpeg',
  };
}