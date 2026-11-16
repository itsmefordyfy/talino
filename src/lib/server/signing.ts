/**
 * Server-only HMAC signatures (Web Crypto, so it runs on EAS Hosting's Workers and in Node). Signs a
 * passed project review so the certificate route can trust it later. REVIEW_SIGNING_SECRET is a long
 * random string set only on the server; without it the development server uses a fixed test secret
 * and production refuses to sign (reviews still work, but can't be turned into a certificate).
 */

const DEV_SECRET = 'talino-development-only-secret';

function secret(): string | null {
  const value = process.env.REVIEW_SIGNING_SECRET?.trim();
  if (value) return value;
  return process.env.NODE_ENV === 'production' ? null : DEV_SECRET;
}

const encoder = new TextEncoder();

function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function key(value: string): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', encoder.encode(value), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
}

/** The signature, or null when the server has no secret. */
export async function sign(message: string): Promise<string | null> {
  const value = secret();
  if (!value) return null;
  return toHex(await crypto.subtle.sign('HMAC', await key(value), encoder.encode(message)));
}

/** Constant-time comparison of a token against the message's signature. */
export async function verify(message: string, token: unknown): Promise<boolean> {
  if (typeof token !== 'string' || !/^[0-9a-f]{64}$/.test(token)) return false;
  const expected = await sign(message);
  if (!expected) return false;
  let diff = 0;
  for (let index = 0; index < expected.length; index += 1) diff |= expected.charCodeAt(index) ^ token.charCodeAt(index);
  return diff === 0;
}
