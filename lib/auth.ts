import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'

export const SESSION_COOKIE = 'dct-admin'
const SESSION_TTL_SECONDS = 60 * 60 * 8

type SessionPayload = { issuedAt: number; expiresAt: number }

export function getAuthConfig() {
  const password = process.env.ADMIN_PASSWORD?.trim() ?? ''
  const secret = process.env.ADMIN_SESSION_SECRET?.trim() ?? ''
  const missing: string[] = []
  if (!password) missing.push('ADMIN_PASSWORD')
  if (secret.length < 32) missing.push('ADMIN_SESSION_SECRET (32+ characters)')
  return { configured: missing.length === 0, missing, password, secret }
}

/** Constant-time compare that also tolerates differing lengths. */
function safeEqual(left: string, right: string) {
  const a = createHash('sha256').update(left).digest()
  const b = createHash('sha256').update(right).digest()
  return timingSafeEqual(a, b)
}

function sign(payload: string, secret: string) {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

export function validatePassword(candidate: string) {
  const config = getAuthConfig()
  if (!config.configured) return false
  return safeEqual(candidate, config.password)
}

export function createSessionToken() {
  const config = getAuthConfig()
  if (!config.configured) return null
  const issuedAt = Math.floor(Date.now() / 1000)
  const payload: SessionPayload = { issuedAt, expiresAt: issuedAt + SESSION_TTL_SECONDS }
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
  return `${encoded}.${sign(encoded, config.secret)}`
}

export function isValidSessionToken(token: string | null | undefined) {
  if (!token) return false
  const config = getAuthConfig()
  if (!config.configured) return false

  const [encoded, signature] = token.split('.')
  if (!encoded || !signature) return false
  if (!safeEqual(signature, sign(encoded, config.secret))) return false

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionPayload
    return typeof payload.expiresAt === 'number' && payload.expiresAt > Math.floor(Date.now() / 1000)
  } catch {
    return false
  }
}

function readCookie(header: string | null, name: string) {
  if (!header) return null
  for (const chunk of header.split(/;\s*/)) {
    const [key, ...rest] = chunk.split('=')
    if (key === name) return rest.join('=')
  }
  return null
}

export function isAuthenticatedRequest(request: Request) {
  return isValidSessionToken(readCookie(request.headers.get('cookie'), SESSION_COOKIE))
}

export function isAuthenticatedCookieStore(store: { get(name: string): { value: string } | undefined }) {
  return isValidSessionToken(store.get(SESSION_COOKIE)?.value ?? null)
}

export function attachSession(response: NextResponse) {
  const token = createSessionToken()
  if (!token) return response
  response.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  })
  return response
}

export function clearSession(response: NextResponse) {
  response.cookies.set({
    name: SESSION_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
  return response
}

export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
