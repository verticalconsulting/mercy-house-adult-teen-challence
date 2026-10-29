import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { secrets } from 'base44:runtime';

// Temporary diagnostic: finds which auth scheme the AI gateway accepts.
export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const accountId = 'af822065bd416045e3a0e3d07e0648fe';
    const clientId = secrets.get('AI_GATEWAY_CLIENT_ID') || '';
    const clientSecret = secrets.get('AI_GATEWAY_CLIENT_SECRET') || '';

    const urls = {
      api: `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/v1/chat/completions`,
      gateway: `https://gateway.ai.cloudflare.com/v1/${accountId}/mercyhouse/openai/chat/completions`,
    };

    const body = JSON.stringify({
      model: 'openai/gpt-4.1',
      messages: [{ role: 'user', content: 'Say ok' }],
      max_tokens: 8,
    });

    const schemes = [
      { name: 'bearer-secret', headers: { Authorization: `Bearer ${clientSecret}` } },
      { name: 'bearer-id', headers: { Authorization: `Bearer ${clientId}` } },
      { name: 'aig-bearer-secret', headers: { 'cf-aig-authorization': `Bearer ${clientSecret}` } },
      { name: 'aig-bearer-id', headers: { 'cf-aig-authorization': `Bearer ${clientId}` } },
      {
        name: 'aig-bearer-secret+access',
        headers: {
          'cf-aig-authorization': `Bearer ${clientSecret}`,
          'CF-Access-Client-Id': clientId,
          'CF-Access-Client-Secret': clientSecret,
        },
      },
    ];

    const results = [];
    for (const [urlName, url] of Object.entries(urls)) {
      for (const scheme of schemes) {
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'cf-aig-gateway-id': 'mercyhouse',
              ...scheme.headers,
            },
            body,
            signal: AbortSignal.timeout(20000),
          });
          const text = await response.text();
          results.push({
            url: urlName,
            scheme: scheme.name,
            status: response.status,
            sample: text.slice(0, 160),
          });
        } catch (error) {
          results.push({ url: urlName, scheme: scheme.name, status: 'fetch-error', sample: error.message });
        }
      }
    }

    return Response.json({ results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}