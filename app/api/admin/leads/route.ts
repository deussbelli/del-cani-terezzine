import { NextResponse } from 'next/server'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { isAuthenticatedRequest, unauthorized } from '@/lib/auth'
import type { Lead } from '@/lib/mailer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const STORE = path.join(process.cwd(), 'data', 'leads.json')

async function readLeads(): Promise<Lead[]> {
  try {
    const parsed = JSON.parse(await fs.readFile(STORE, 'utf8'))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/** Quotes a value for CSV and neutralises spreadsheet formula injection. */
function csvCell(value: string) {
  const safe = /^[=+\-@]/.test(value) ? `'${value}` : value
  return `"${safe.replace(/"/g, '""')}"`
}

export async function GET(request: Request) {
  if (!isAuthenticatedRequest(request)) return unauthorized()

  const leads = await readLeads()
  const header = ['Received', 'First name', 'Last name', 'Phone', 'Language', 'Note']
  const rows = leads.map((lead) =>
    [lead.receivedAt, lead.firstName, lead.lastName, lead.phone, lead.lang, lead.note]
      .map((value) => csvCell(String(value ?? '')))
      .join(','),
  )

  // The BOM keeps Excel from mangling Cyrillic names.
  const body = `\uFEFF${[header.map(csvCell).join(','), ...rows].join('\r\n')}\r\n`

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="del-cani-terezzine-leads.csv"',
      'Cache-Control': 'no-store',
    },
  })
}
