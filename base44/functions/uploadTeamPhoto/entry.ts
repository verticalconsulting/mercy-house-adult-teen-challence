import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { secrets } from 'base44:runtime';

// Cloudflare Images account (hash is the public delivery host; the API token is the secret).
const ACCOUNT_ID = 'af822065bd416045e3a0e3d07e0648fe';
const ACCOUNT_HASH = 'dXRounTcgmfhZwbsZCZLTw';
const MAX_BYTES = 4 * 1024 * 1024;

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const image = body.image;
    const memberName = typeof body.memberName === 'string' ? body.memberName.trim() : '';

    if (typeof image !== 'string' || !image.startsWith('data:image/')) {
      return Response.json({ error: 'image must be a base64 image data URL' }, { status: 400 });
    }
    if (!memberName || memberName.length > 120) {
      return Response.json({ error: 'memberName is required' }, { status: 400 });
    }

    const base64 = image.split(',')[1] || '';
    if (!base64) return Response.json({ error: 'image payload is empty' }, { status: 400 });

    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    if (!bytes.length) return Response.json({ error: 'image payload is empty' }, { status: 400 });
    if (bytes.length > MAX_BYTES) {
      return Response.json({ error: 'Compressed image is too large (4 MB max)' }, { status: 413 });
    }

    const token = secrets.get('CLOUDFLARE_IMAGES_API_TOKEN');
    if (!token) {
      return Response.json({ error: 'Cloudflare Images API token is not configured' }, { status: 500 });
    }

    const filename = `${memberName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'team-member'}.jpg`;

    const form = new FormData();
    form.append('file', new Blob([bytes], { type: 'image/jpeg' }), filename);
    form.append('metadata', JSON.stringify({ member: memberName }));

    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v1`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
      signal: AbortSignal.timeout(25000),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      const message = data?.errors?.[0]?.message || `Cloudflare Images upload failed (${res.status})`;
      return Response.json({ error: message }, { status: 502 });
    }

    const id = data.result.id;
    const url = data.result?.variants?.[0] || `https://imagedelivery.net/${ACCOUNT_HASH}/${id}/public`;

    return Response.json({ id, url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}