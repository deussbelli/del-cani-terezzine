# Del Cani Terezzine

A single-page site for a small Cane Corso Italiano kennel: breed notes, the
kennel's own terms, a photo rail, a video rail, the pedigree behind the current
line, and a call-back form that reaches the breeder.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · Nodemailer

## What is in here

- **Three languages** — English (main), Ukrainian and Russian, switched in the
  header. The choice is remembered; English is what every first visit sees.
- **Photo rail and video rail** — horizontal, snap-scrolling rows. Photographs
  open in a lightbox.
- **Call-back form** — first name, last name, phone. Validated on the server,
  stored, and emailed on when SMTP is configured.
- **Call button** — opens the dialler with the kennel number already filled in.
- **Admin panel** at `/admin` — password-protected upload and removal of photos
  and video. New media appears on the site immediately, no rebuild.
- Responsive from 360 px upwards.

## Running it

```bash
npm install
cp .env.example .env.local   # then fill in the values you actually have
npm run dev                  # http://localhost:4320
```

The admin panel lives at <http://localhost:4320/admin>.

## Configuration

Every secret comes from the environment. `.env.local` is git-ignored; only
`.env.example` is committed.

| Variable | Purpose |
| --- | --- |
| `LEAD_NOTIFY_TO` | Address that receives call-back requests |
| `NEXT_PUBLIC_KENNEL_PHONE` | Number shown on the page and used by the call button |
| `NEXT_PUBLIC_KENNEL_EMAIL` | Public contact address |
| `SMTP_HOST` | Mail host. Leave empty to run in log-only mode |
| `SMTP_PORT` | Defaults to `587` |
| `SMTP_SECURE` | `true` for implicit TLS (port 465) |
| `SMTP_USER` / `SMTP_PASS` | Credentials, if the host needs them |
| `SMTP_FROM` | Envelope sender |
| `ADMIN_PASSWORD` | Password for `/admin` |
| `ADMIN_SESSION_SECRET` | 32+ random characters used to sign the session cookie |

> Quote any value containing `#` or `$`. Unquoted, the parser treats `#` as the
> start of a comment and silently truncates the value.

## How uploads are handled

- Only declared image and video MIME types are accepted; the extension is taken
  from the type, never from the filename, so nothing else can be smuggled in.
- Limits: 12 MB per photo, 120 MB per video.
- Files land in `public/uploads/`, metadata in `data/media.json`. Both are
  git-ignored — uploads are runtime content, not source.
- The photographs shipped in `public/dogs/` are always shown and cannot be
  deleted from the panel.

## Requests

Call-back requests are appended to `data/leads.json` and emailed to
`LEAD_NOTIFY_TO`. Without SMTP the site still works and nothing is lost — the
queue is simply read by hand. There is a honeypot field and a per-IP rate limit
on the endpoint.
