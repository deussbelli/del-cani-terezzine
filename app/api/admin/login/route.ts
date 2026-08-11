import { NextResponse } from 'next/server'
import { attachSession, clearSession, getAuthConfig, validatePassword } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const config = getAuthConfig()
  if (!config.configured) {
    return NextResponse.json(
      { error: `Admin access is not configured. Set: ${config.missing.join(', ')}` },
      { status: 503 },
    )
  }

  const body = await request.json().catch(() => null)
  const password = typeof (body as { password?: unknown } | null)?.password === 'string'
    ? (body as { password: string }).password
    : ''

  if (!validatePassword(password)) {
    return NextResponse.json({ error: 'Wrong password.' }, { status: 401 })
  }

  return attachSession(NextResponse.json({ ok: true }))
}

export async function DELETE() {
  return clearSession(NextResponse.json({ ok: true }))
}
