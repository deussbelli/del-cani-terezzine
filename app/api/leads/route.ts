import { NextResponse } from 'next/server'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { deliverLead, type Lead } from '@/lib/mailer'
import { isLang } from '@/lib/i18n'

export const runtime = 'nodejs'

const STORE = path.join(process.cwd(), 'data', 'leads.json')

/** Small in-memory throttle so one client cannot flood the kennel. */
const recent = new Map<string, number[]>()
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 5

function throttled(key: string) {
  const now = Date.now()
  const hits = (recent.get(key) ?? []).filter((t) => now - t < WINDOW_MS)
  hits.push(now)
  recent.set(key, hits)
  return hits.length > MAX_PER_WINDOW
}

function clean(value: unknown, max: number) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, max) : ''
}

async function append(lead: Lead) {
  await fs.mkdir(path.dirname(STORE), { recursive: true })
  let existing: Lead[] = []
  try {
    const parsed = JSON.parse(await fs.readFile(STORE, 'utf8'))
    if (Array.isArray(parsed)) existing = parsed
  } catch {
    existing = []
  }
  existing.unshift(lead)
  await fs.writeFile(STORE, JSON.stringify(existing.slice(0, 500), null, 2), 'utf8')
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
  if (throttled(ip)) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
  }

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ ok: false, error: 'bad_request' }, { status: 400 })
  }

  const raw = body as Record<string, unknown>

  // Hidden from people, irresistible to bots.
  if (clean(raw.company, 40)) {
    return NextResponse.json({ ok: true, reference: 'accepted' })
  }

  const firstName = clean(raw.firstName, 60)
  const lastName = clean(raw.lastName, 60)
  const phone = clean(raw.phone, 32)
  const note = clean(raw.note, 1000)
  const lang = isLang(raw.lang) ? raw.lang : 'en'

  const errors: Record<string, true> = {}
  if (firstName.length < 2) errors.firstName = true
  if (lastName.length < 2) errors.lastName = true
  // Digits only, ignoring the usual +, spaces, dashes and brackets.
  if ((phone.match(/\d/g) ?? []).length < 7) errors.phone = true

  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 })
  }

  const lead: Lead = {
    id: randomUUID(),
    firstName,
    lastName,
    phone,
    note,
    lang,
    receivedAt: new Date().toISOString(),
  }

  await append(lead)
  const delivery = await deliverLead(lead)

  return NextResponse.json({
    ok: true,
    reference: lead.id.slice(0, 8).toUpperCase(),
    delivered: delivery.delivered,
  })
}
