import { secrets } from 'base44:runtime';

// Cloudflare AI Gateway for Mercy House. All model traffic goes through the
// "mercyhouse" gateway so usage, caching and rate limits live in one place.
// Auth is the gateway's Access service token, held in the app's secrets.
const ACCOUNT_ID = 'af822065bd416045e3a0e3d07e0648fe';
const GATEWAY_ID = 'mercyhouse';
const CHAT_URL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/v1/chat/completions`;
const RUN_URL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run`;

export const DEFAULT_TEXT_MODEL = 'openai/gpt-4.1';

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

/** Turns a prompt plus an optional image URL into a plain-text answer. */
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
 * Text-to-image through the gateway. Returns { base64, contentType } — the
 * caller decides where the bytes get stored.
 */
export async function generateImage({ prompt, model = 'google/nano-banana', timeoutMs = 120000 }) {
  const data = await postJson(
    RUN_URL,
    { model, input: { prompt } },
    timeoutMs,
  );

  const result = data?.result ?? data;
  const base64 =
    result?.image ||
    result?.data?.[0]?.b64_json ||
    result?.images?.[0] ||
    result?.choices?.[0]?.message?.images?.[0]?.image_url?.url;

  if (!base64 || typeof base64 !== 'string') {
    throw new Error('The AI gateway returned no image data');
  }
  if (base64.startsWith('http')) {
    return { url: base64 };
  }
  return {
    base64: base64.replace(/^data:image\/\w+;base64,/, ''),
    contentType: 'image/png',
  };
}