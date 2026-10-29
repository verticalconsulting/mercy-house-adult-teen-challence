import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { secrets } from 'base44:runtime';

// Cloudflare R2 bucket behind files.mercyhouseatc.com. Uploads are signed with
// the S3 API (SigV4) because R2's S3 endpoint takes an access key pair, not a
// plain key header.
const ACCOUNT_ID = 'af822065bd416045e3a0e3d07e0648fe';
const BUCKET = 'mercyhouse';
const PUBLIC_BASE = 'https://files.mercyhouseatc.com';
const KEY_PREFIX = 'files';
const MAX_BYTES = 8 * 1024 * 1024;

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function sha256Hex(data: Uint8Array | string) {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  return toHex(await crypto.subtle.digest('SHA-256', bytes));
}

async function hmac(key: Uint8Array, message: string) {
  const cryptoKey = await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return new Uint8Array(await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(message)));
}

function base64ToBytes(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function safeObjectName(fileName: string) {
  const base = String(fileName || 'document.pdf').split(/[\\/]/).pop() || 'document.pdf';
  const cleaned = base
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '');
  return cleaned || `document-${Date.now()}.pdf`;
}

export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const { file_name, content_type, data_base64 } = body || {};
    if (!file_name || !data_base64) {
      return Response.json({ error: 'file_name and data_base64 are required' }, { status: 400 });
    }

    const payload = base64ToBytes(String(data_base64));
    if (payload.byteLength === 0) return Response.json({ error: 'The file is empty' }, { status: 400 });
    if (payload.byteLength > MAX_BYTES) {
      return Response.json({ error: 'Files must be 8 MB or smaller' }, { status: 413 });
    }

    const accessKeyId = secrets.get('R2_ACCESS_KEY_ID');
    const secretAccessKey = secrets.get('R2_SECRET_ACCESS_KEY');
    if (!accessKeyId || !secretAccessKey) {
      return Response.json({ error: 'R2 credentials are not configured' }, { status: 500 });
    }

    const key = `${KEY_PREFIX}/${safeObjectName(file_name)}`;
    const canonicalUri = `/${BUCKET}/${key.split('/').map(encodeURIComponent).join('/')}`;
    const host = `${ACCOUNT_ID}.r2.cloudflarestorage.com`;
    const endpoint = `https://${host}${canonicalUri}`;
    const contentType = String(content_type || 'application/octet-stream').slice(0, 120);

    const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dateStamp = amzDate.slice(0, 8);
    const payloadHash = await sha256Hex(payload);

    const canonicalHeaders =
      `content-type:${contentType}\n` +
      `host:${host}\n` +
      `x-amz-content-sha256:${payloadHash}\n` +
      `x-amz-date:${amzDate}\n`;
    const signedHeaders = 'content-type;host;x-amz-content-sha256;x-amz-date';
    const canonicalRequest =
      `PUT\n${canonicalUri}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

    const scope = `${dateStamp}/auto/s3/aws4_request`;
    const stringToSign =
      `AWS4-HMAC-SHA256\n${amzDate}\n${scope}\n${await sha256Hex(canonicalRequest)}`;

    const kDate = await hmac(new TextEncoder().encode(`AWS4${secretAccessKey}`), dateStamp);
    const kRegion = await hmac(kDate, 'auto');
    const kService = await hmac(kRegion, 's3');
    const kSigning = await hmac(kService, 'aws4_request');
    const signature = toHex(await hmac(kSigning, stringToSign));

    const uploadResponse = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
        'x-amz-content-sha256': payloadHash,
        'x-amz-date': amzDate,
        Authorization:
          `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${scope}, ` +
          `SignedHeaders=${signedHeaders}, Signature=${signature}`,
      },
      body: payload,
      signal: AbortSignal.timeout(30000),
    });

    if (!uploadResponse.ok) {
      const detail = await uploadResponse.text();
      console.error('R2 upload failed', uploadResponse.status, detail.slice(0, 500));
      return Response.json(
        { error: `Upload failed (${uploadResponse.status})`, detail: detail.slice(0, 300) },
        { status: 502 },
      );
    }

    return Response.json({ url: `${PUBLIC_BASE}/${key}`, key });
  } catch (error) {
    console.error('uploadFileResource failed', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}