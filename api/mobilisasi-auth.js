// Serves /api/mobilisasi-auth. POST { pin } -> sets a signed session cookie
// on success. Every failure path (wrong pin, missing pin, non-POST request)
// returns the same generic 401 message so nothing about the gate's
// internals leaks beyond "incorrect PIN".
const crypto = require('crypto');

const PIN = '0139';
const COOKIE_NAME = 'mob_session';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days
// Must match the signing secret in api/mobilisasi.js exactly.
const SECRET = 'jati-mobilisasi-9f3c7a1e6b8d4f02a5c9e7b3d1f8a6c4-signing-key';

function makeToken() {
  return crypto.createHmac('sha256', SECRET).update('mobilisasi-session-v1').digest('hex');
}

function safeEqual(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch (e) { return {}; }
  }
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(data || '{}')); } catch (e) { resolve({}); }
    });
    req.on('error', () => resolve({}));
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(401).json({ error: 'incorrect PIN' });
    return;
  }

  const body = await readJsonBody(req);
  const pin = body && typeof body.pin === 'string' ? body.pin : '';

  if (!pin || !safeEqual(pin, PIN)) {
    res.status(401).json({ error: 'incorrect PIN' });
    return;
  }

  const token = makeToken();
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`
  );
  res.status(200).json({ ok: true });
};
