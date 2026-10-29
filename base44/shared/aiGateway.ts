import { secrets } from 'base44:runtime';

// Cloudflare AI Gateway for Mercy House. All model traffic goes through the
// "mercyhouse" gateway so usage, caching and rate limits live in one place.
//
// Auth: a Cloudflare API token (AI Gateway: Run + Workers AI: Read) for account
// af822065bd416045e3a0e3d07e0648fe, held in the app secrets as
// CLOUDFLARE_API_TOKEN.
//
// Models: Workers AI models (`@cf/...`) run against the account's Workers AI
// allowance. Hosted provider models (openai/..., anthropic/..., google/...) need
// credits or a BYOK key on the gateway — swap the constants below once that is
// set up; nothing else has to change.
const ACCOUNT_ID = 'af822065bd416045e3a0e3d07e0648fe';
const GATEWAY_ID = 'mercyhouse';
const CHAT_URL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/v1/chat/completions`;
const RUN_URL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run`;

export const DEFAULT_TEXT_MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
export const VISION_MODEL = '@cf/meta/llama-4-scout-17b-16e-instruct';
export const DEFAULT_IMAGE_MODEL = '@cf/black-forest-labs/flux-1-schnell';

function authHeaders() {
  const token = secrets.get('CLOUDFLARE_API_TOKEN');
  if (!token) {
    throw new Error('AI gateway credentials are not configured');
  }
  return {
    'Content-Type': 'application/json',
    'cf-aig-gateway-id': GATEWAY_ID,
    Authorization: `Bearer ${token}`,
  };
}

async function postJson(url, body, timeoutMs) {
  const response = await fetch(url, {
    method: 'POST',
    headers: authHeaders(),
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
    { model, messages, max_tokens: maxTokens },
    timeoutMs,
  );
  return readContent(data);
}

/** Fetches an image and inlines it as base64 — Workers AI vision needs raw data. */
export async function toDataUrl(imageUrl, timeoutMs = 20000) {
  const response = await fetch(imageUrl, { signal: AbortSignal.timeout(timeoutMs) });
  if (!response.ok) throw new Error(`Could not load the image (${response.status})`);
  const contentType = response.headers.get('content-type') || 'image/jpeg';
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.byteLength > 8 * 1024 * 1024) {
    throw new Error('That image is too large to analyze');
  }
  let binary = '';
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return `data:${contentType};base64,${btoa(binary)}`;
}

/** Turns a prompt plus an optional base64 image into a chat message list. */
export function buildUserMessage(text, imageDataUrl) {
  if (!imageDataUrl) return [{ role: 'user', content: text }];
  return [
    {
      role: 'user',
      content: [
        { type: 'text', text },
        { type: 'image_url', image_url: { url: imageDataUrl } },
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
  const data = await postJson(RUN_URL, { model, input: { prompt } }, timeoutMs);

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