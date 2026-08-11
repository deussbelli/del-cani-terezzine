import nodemailer from 'nodemailer'

export type Lead = {
  id: string
  firstName: string
  lastName: string
  phone: string
  note: string
  lang: string
  receivedAt: string
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Delivers a call-back request. Without SMTP credentials the lead is still
 * stored and the visitor still gets a confirmation — the kennel just reads the
 * queue by hand. Credentials and the destination come only from the env.
 */
export async function deliverLead(lead: Lead): Promise<{ delivered: boolean }> {
  const host = process.env.SMTP_HOST
  const to = process.env.LEAD_NOTIFY_TO

  if (!host || !to) {
    console.info(`[lead] stored ${lead.id} (mail transport not configured)`)
    return { delivered: false }
  }

  const transport = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS ?? '' }
      : undefined,
  })

  const rows: Array<[string, string]> = [
    ['Name', `${lead.firstName} ${lead.lastName}`],
    ['Phone', lead.phone],
    ['Page language', lead.lang.toUpperCase()],
    ['Received', new Date(lead.receivedAt).toUTCString()],
  ]

  try {
    await transport.sendMail({
      from: process.env.SMTP_FROM ?? `Del Cani Terezzine <no-reply@${host}>`,
      to,
      subject: `Call back request — ${lead.firstName} ${lead.lastName} — ${lead.phone}`,
      text: [...rows.map(([k, v]) => `${k}: ${v}`), '', lead.note || '(no note)'].join('\n'),
      html: `
        <div style="font-family:Georgia,serif;max-width:560px;color:#15161a">
          <h2 style="font-weight:400">New call-back request</h2>
          <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:14px">
            ${rows
              .map(
                ([k, v]) =>
                  `<tr><td style="padding:6px 12px 6px 0;color:#6b7280">${k}</td><td style="padding:6px 0"><strong>${escapeHtml(v)}</strong></td></tr>`,
              )
              .join('')}
          </table>
          <p style="white-space:pre-wrap;font-family:Arial,sans-serif;font-size:14px;line-height:1.6">${escapeHtml(lead.note || '(no note)')}</p>
        </div>`,
    })
    return { delivered: true }
  } catch (error) {
    console.error('[lead] delivery failed', error instanceof Error ? error.message : error)
    return { delivered: false }
  }
}
