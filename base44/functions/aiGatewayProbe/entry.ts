import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { secrets } from 'base44:runtime';

// Temporary diagnostic: checks whether the stored Cloudflare API token is valid
// and whether it can reach the AI Gateway. Returns status codes only.
export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const token = secrets.get('CLOUDFLARE_API_TOKEN') || '';
    const accountId = 'af822065bd416045e3a0e3d07e0648fe';

    const checks = [];

    // 1. Is the token itself valid?
    const verify = await fetch('https://api.cloudflare.com/client/v4/user/tokens/verify', {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(15000),
    });
    const verifyBody = await verify.text();
    checks.push({
      step: 'token-verify',
      status: verify.status,
      tokenLength: token.length,
      sample: verifyBody.slice(0, 240),
    });

    // 2. Can it see the account?
    const acct = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(15000),
    });
    checks.push({ step: 'account-read', status: acct.status, sample: (await acct.text()).slice(0, 200) });

    // 3. Plain Workers AI run through the gateway id header
    const run = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'cf-aig-gateway-id': 'mercyhouse',
      },
      body: JSON.stringify({ model: '@cf/meta/llama-3.1-8b-instruct', input: { messages: [{ role: 'user', content: 'Say ok' }] } }),
      signal: AbortSignal.timeout(25000),
    });
    checks.push({ step: 'workers-ai-run', status: run.status, sample: (await run.text()).slice(0, 240) });

    // 4. OpenAI-compatible chat completions with a provider model
    const chat = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'cf-aig-gateway-id': 'mercyhouse',
      },
      body: JSON.stringify({ model: 'openai/gpt-4.1', messages: [{ role: 'user', content: 'Say ok' }], max_tokens: 8 }),
      signal: AbortSignal.timeout(25000),
    });
    checks.push({ step: 'chat-completions', status: chat.status, sample: (await chat.text()).slice(0, 240) });

    return Response.json({ checks });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}