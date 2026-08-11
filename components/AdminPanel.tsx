'use client'

import { useCallback, useEffect, useState } from 'react'
import type { MediaItem } from '@/lib/media-store'

type Props = {
  readonly configured: boolean
  readonly missing: string[]
}

export default function AdminPanel({ configured, missing }: Props) {
  const [signedIn, setSignedIn] = useState(false)
  const [checking, setChecking] = useState(true)
  const [uploaded, setUploaded] = useState<MediaItem[]>([])
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    const response = await fetch('/api/admin/media', { cache: 'no-store' })
    if (response.status === 401) {
      setSignedIn(false)
      return
    }
    const payload = await response.json()
    setUploaded(payload.uploaded ?? [])
    setSignedIn(true)
  }, [])

  useEffect(() => {
    void load().finally(() => setChecking(false))
  }, [load])

  if (!configured) {
    return (
      <Shell>
        <h1 className="font-display text-3xl">Admin access is not configured</h1>
        <p className="mt-4 text-sm leading-relaxed text-bone/60">
          Set these in <code className="text-bronze-bright">.env.local</code> and restart the server:
        </p>
        <ul className="mt-4 space-y-1.5 text-sm text-bone/72">
          {missing.map((item) => (
            <li key={item}>· {item}</li>
          ))}
        </ul>
        <p className="mt-5 text-xs leading-relaxed text-bone/45">
          Wrap any value containing <code>#</code> or <code>$</code> in quotes — otherwise it is
          silently truncated at that character.
        </p>
      </Shell>
    )
  }

  if (checking) {
    return (
      <Shell>
        <p className="text-sm text-bone/50">Checking session…</p>
      </Shell>
    )
  }

  if (!signedIn) {
    return <SignIn onSuccess={load} />
  }

  return (
    <Shell wide>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Kennel admin</p>
          <h1 className="font-display mt-2 text-4xl">Photos &amp; video</h1>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" className="text-[0.66rem] uppercase tracking-[0.2em] text-bone/50 hover:text-bronze-bright">
            View site
          </a>
          <a
            href="/api/admin/leads"
            download
            className="text-[0.66rem] uppercase tracking-[0.2em] text-bone/50 hover:text-bronze-bright"
          >
            Export requests
          </a>
          <button
            type="button"
            onClick={async () => {
              await fetch('/api/admin/login', { method: 'DELETE' })
              setSignedIn(false)
            }}
            className="text-[0.66rem] uppercase tracking-[0.2em] text-bone/50 hover:text-bronze-bright"
          >
            Sign out
          </button>
        </div>
      </div>

      <UploadForm
        onUploaded={(item) => {
          setUploaded((current) => [item, ...current])
          setError('')
        }}
        onError={setError}
      />

      {error ? <p className="mt-4 text-sm text-[#e2837a]">{error}</p> : null}

      <div className="mt-12">
        <h2 className="font-display text-2xl">Uploaded media</h2>
        <p className="mt-2 text-sm text-bone/50">
          The photographs that ship with the site are always shown and are not listed here.
        </p>

        {uploaded.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-dashed border-bone/14 px-6 py-10 text-center text-sm text-bone/45">
            Nothing uploaded yet.
          </p>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {uploaded.map((item) => (
              <li key={item.id} className="overflow-hidden rounded-2xl border border-bone/10 bg-graphite">
                {item.kind === 'photo' ? (
                  <img src={item.src} alt={item.caption} className="aspect-[4/3] w-full object-cover" />
                ) : (
                  <video src={item.src} controls preload="metadata" className="aspect-[4/3] w-full bg-obsidian object-cover" />
                )}
                <div className="flex items-start justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="text-[0.6rem] uppercase tracking-[0.2em] text-bronze/85">{item.kind}</p>
                    <p className="mt-1 truncate text-sm text-bone/70">{item.caption || '—'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      const response = await fetch('/api/admin/media', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: item.id }),
                      })
                      if (response.ok) {
                        setUploaded((current) => current.filter((entry) => entry.id !== item.id))
                      } else {
                        const payload = await response.json().catch(() => null)
                        setError(payload?.error ?? 'Could not delete that item.')
                      }
                    }}
                    className="shrink-0 text-[0.62rem] uppercase tracking-[0.18em] text-bone/45 transition-colors hover:text-[#e2837a]"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Shell>
  )
}

function UploadForm({
  onUploaded,
  onError,
}: {
  readonly onUploaded: (item: MediaItem) => void
  readonly onError: (message: string) => void
}) {
  const [busy, setBusy] = useState(false)

  return (
    <form
      className="glass mt-10 rounded-[1.4rem] p-6 md:p-8"
      onSubmit={async (event) => {
        event.preventDefault()
        if (busy) return
        const form = event.currentTarget
        setBusy(true)
        onError('')
        try {
          const response = await fetch('/api/admin/media', {
            method: 'POST',
            body: new FormData(form),
          })
          const payload = await response.json().catch(() => null)
          if (!response.ok) {
            onError(payload?.error ?? 'Upload failed.')
            return
          }
          onUploaded(payload.item)
          form.reset()
        } catch {
          onError('Could not reach the server.')
        } finally {
          setBusy(false)
        }
      }}
    >
      <p className="eyebrow">Add media</p>
      <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <label className="block">
          <span className="text-xs text-bone/55">File</span>
          <input
            type="file"
            name="file"
            required
            accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,video/quicktime"
            className="field mt-2 file:mr-3 file:rounded-full file:border-0 file:bg-bronze file:px-4 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:tracking-widest file:text-obsidian"
          />
        </label>
        <label className="block">
          <span className="text-xs text-bone/55">Caption</span>
          <input name="caption" className="field mt-2" placeholder="Ahiles, 2 years — spring show" />
        </label>
        <button type="submit" disabled={busy} className="btn-primary">
          {busy ? 'Uploading…' : 'Upload'}
        </button>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-bone/42">
        Photos up to 12 MB (JPEG, PNG, WebP, AVIF). Video up to 120 MB (MP4, WebM, MOV). New items
        appear on the site immediately.
      </p>
    </form>
  )
}

function SignIn({ onSuccess }: { readonly onSuccess: () => void | Promise<void> }) {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  return (
    <Shell>
      <p className="eyebrow">Kennel admin</p>
      <h1 className="font-display mt-2 text-4xl">Sign in</h1>
      <form
        className="mt-8"
        onSubmit={async (event) => {
          event.preventDefault()
          const password = new FormData(event.currentTarget).get('password')
          setBusy(true)
          setError('')
          try {
            const response = await fetch('/api/admin/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ password }),
            })
            if (!response.ok) {
              const payload = await response.json().catch(() => null)
              setError(payload?.error ?? 'Sign in failed.')
              return
            }
            await onSuccess()
          } catch {
            setError('Could not reach the server.')
          } finally {
            setBusy(false)
          }
        }}
      >
        <label className="block">
          <span className="text-xs text-bone/55">Password</span>
          <input type="password" name="password" autoComplete="current-password" className="field mt-2" />
        </label>
        {error ? <p className="mt-3 text-sm text-[#e2837a]">{error}</p> : null}
        <button type="submit" disabled={busy} className="btn-primary mt-6 w-full">
          {busy ? 'Checking…' : 'Sign in'}
        </button>
      </form>
    </Shell>
  )
}

function Shell({ children, wide }: { readonly children: React.ReactNode; readonly wide?: boolean }) {
  return (
    <main className="min-h-screen px-5 py-16 md:px-8 md:py-24">
      <div className={wide ? 'mx-auto max-w-5xl' : 'mx-auto max-w-md'}>{children}</div>
    </main>
  )
}
