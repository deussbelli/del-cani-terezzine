'use client'

import { useEffect, useMemo, useState } from 'react'
import { LANGS, LANG_LABELS, dictionaries, isLang, type Lang } from '@/lib/i18n'
import type { MediaItem } from '@/lib/media-store'

const LANG_STORAGE_KEY = 'dct-lang'

type Props = {
  readonly photos: MediaItem[]
  readonly videos: MediaItem[]
  readonly phone: string
  readonly email: string
}

type FormErrors = Partial<Record<'firstName' | 'lastName' | 'phone', boolean>>

export default function KennelSite({ photos, videos, phone, email }: Props) {
  const [lang, setLang] = useState<Lang>('en')
  const [lightbox, setLightbox] = useState<MediaItem | null>(null)

  // English is the site's main language. Only an explicit choice overrides it,
  // so a Ukrainian or Russian browser still lands on the English page first.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY)
      if (isLang(saved)) setLang(saved)
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang)
    } catch {}
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    if (!lightbox) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  const t = dictionaries[lang]
  const telHref = useMemo(() => `tel:${phone.replace(/[^+\d]/g, '')}`, [phone])

  const nav = [
    { href: '#breed', label: t.nav.breed },
    { href: '#kennel', label: t.nav.kennel },
    { href: '#gallery', label: t.nav.gallery },
    { href: '#film', label: t.nav.film },
    { href: '#pedigree', label: t.nav.pedigree },
    { href: '#people', label: t.nav.people },
  ]

  return (
    <main className="relative">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-bone/8 bg-obsidian/78 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:h-20 md:px-8">
          <a href="#top" className="flex shrink-0 items-center gap-3">
            <img src="/logo.svg" alt="" className="h-9 w-9 md:h-10 md:w-10" />
            <span className="font-display hidden text-lg leading-tight tracking-wide sm:block md:text-xl">
              Del Cani
              <br />
              Terezzine
            </span>
          </a>

          <nav className="mx-auto hidden items-center gap-7 lg:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[0.68rem] uppercase tracking-[0.2em] text-bone/56 transition-colors hover:text-bronze-bright"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <div className="flex items-center rounded-full border border-bone/12 p-0.5">
              {LANGS.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  aria-pressed={lang === code}
                  className={`rounded-full px-2.5 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.16em] transition-colors ${
                    lang === code ? 'bg-bronze text-obsidian' : 'text-bone/55 hover:text-bone'
                  }`}
                >
                  {LANG_LABELS[code]}
                </button>
              ))}
            </div>
            <a
              href="#enquire"
              className="hidden rounded-full border border-bronze/45 px-4 py-2 text-[0.64rem] uppercase tracking-[0.22em] text-bronze-bright transition-colors hover:bg-bronze/10 sm:inline-flex"
            >
              {t.nav.enquire}
            </a>
          </div>
        </div>
      </header>

      {/* ─────────────────────────── hero ─────────────────────────── */}
      <section id="top" className="relative min-h-[92vh] overflow-hidden">
        <img
          src="/dogs/sentinel.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[60%_28%]"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(100deg, rgba(8,8,10,0.94) 0%, rgba(8,8,10,0.76) 34%, rgba(8,8,10,0.24) 62%, rgba(8,8,10,0.55) 100%)',
          }}
        />
        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-end px-5 pb-16 pt-32 md:px-8 md:pb-24">
          <div className="rise max-w-2xl">
            <p className="eyebrow">{t.hero.eyebrow}</p>
            <h1 className="font-display mt-5 whitespace-pre-line text-[3.6rem] leading-[0.9] tracking-[-0.03em] sm:text-7xl lg:text-8xl">
              {t.hero.title}
            </h1>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-bone/72 md:text-lg">
              {t.hero.lead}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#enquire" className="btn-primary">
                {t.hero.primary}
              </a>
              <a href={telHref} className="btn-ghost">
                {t.hero.secondary}
              </a>
            </div>

            <dl className="mt-12 flex flex-wrap gap-x-12 gap-y-6">
              {t.hero.stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="font-display text-3xl text-bronze-bright">{stat.value}</dt>
                  <dd className="mt-1 max-w-[11rem] text-[0.68rem] uppercase tracking-[0.16em] text-bone/45">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ─────────────────────────── breed ─────────────────────────── */}
      <section id="breed" className="px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <p className="eyebrow">{t.breed.eyebrow}</p>
              <h2 className="font-display mt-5 whitespace-pre-line text-4xl leading-[1.04] md:text-6xl">
                {t.breed.title}
              </h2>
            </div>
            <p className="self-end text-base leading-relaxed text-bone/64 md:text-lg">{t.breed.lead}</p>
          </div>

          <div className="rule mt-14" />

          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {t.breed.points.map((point, index) => (
              <article key={point.title}>
                <span className="font-display text-5xl text-bronze/25">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display mt-3 text-2xl">{point.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-bone/56">{point.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────── kennel ─────────────────────────── */}
      <section id="kennel" className="px-5 pb-24 md:px-8 md:pb-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <figure className="overflow-hidden rounded-[1.8rem] border border-bone/10">
            <img
              src="/dogs/high-guard.webp"
              alt=""
              className="aspect-[4/5] w-full object-cover"
              loading="lazy"
            />
          </figure>
          <div>
            <p className="eyebrow">{t.kennel.eyebrow}</p>
            <h2 className="font-display mt-5 whitespace-pre-line text-4xl leading-[1.04] md:text-6xl">
              {t.kennel.title}
            </h2>
            <p className="mt-6 leading-relaxed text-bone/64">{t.kennel.lead}</p>
            <dl className="mt-9 space-y-px">
              {t.kennel.facts.map((fact) => (
                <div key={fact.term} className="grid gap-1 border-t border-bone/10 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
                  <dt className="text-[0.64rem] uppercase tracking-[0.2em] text-bronze/85">{fact.term}</dt>
                  <dd className="text-sm leading-relaxed text-bone/62">{fact.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ─────────────────────────── photo rail ─────────────────────────── */}
      <section id="gallery" className="pb-24 md:pb-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="eyebrow">{t.gallery.eyebrow}</p>
          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h2 className="font-display text-4xl md:text-5xl">{t.gallery.title}</h2>
            <p className="max-w-sm text-sm leading-relaxed text-bone/48">{t.gallery.note}</p>
          </div>
        </div>

        {photos.length === 0 ? (
          <p className="mx-auto mt-10 max-w-7xl px-5 text-bone/45 md:px-8">{t.gallery.empty}</p>
        ) : (
          <div className="rail mt-9">
            {photos.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setLightbox(photo)}
                className="group relative overflow-hidden rounded-[1.4rem] border border-bone/10 text-left"
              >
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  loading="lazy"
                />
                {photo.caption ? (
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-obsidian/92 to-transparent px-4 pb-4 pt-10 text-xs leading-snug text-bone/78">
                    {photo.caption}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ─────────────────────────── video rail ─────────────────────────── */}
      <section id="film" className="pb-24 md:pb-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="eyebrow">{t.film.eyebrow}</p>
          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h2 className="font-display text-4xl md:text-5xl">{t.film.title}</h2>
            <p className="max-w-sm text-sm leading-relaxed text-bone/48">{t.film.note}</p>
          </div>
        </div>

        {videos.length === 0 ? (
          <div className="mx-auto mt-9 max-w-7xl px-5 md:px-8">
            <div className="glass flex min-h-[13rem] items-center justify-center rounded-[1.4rem] px-6 text-center text-sm text-bone/50">
              {t.film.empty}
            </div>
          </div>
        ) : (
          <div className="rail mt-9">
            {videos.map((video) => (
              <figure key={video.id} className="overflow-hidden rounded-[1.4rem] border border-bone/10">
                <video
                  src={video.src}
                  controls
                  preload="metadata"
                  playsInline
                  className="aspect-[3/4] w-full bg-graphite object-cover"
                />
                {video.caption ? (
                  <figcaption className="px-4 py-3 text-xs text-bone/62">{video.caption}</figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        )}
      </section>

      {/* ─────────────────────────── pedigree ─────────────────────────── */}
      <section id="pedigree" className="px-5 pb-24 md:px-8 md:pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <p className="eyebrow">{t.pedigree.eyebrow}</p>
              <h2 className="font-display mt-5 whitespace-pre-line text-4xl leading-[1.04] md:text-6xl">
                {t.pedigree.title}
              </h2>
            </div>
            <p className="self-end leading-relaxed text-bone/64">{t.pedigree.lead}</p>
          </div>

          <figure className="mt-12 overflow-hidden rounded-[1.6rem] border border-bronze/22">
            <img
              src="/dogs/pedigree.webp"
              alt={t.pedigree.union}
              className="w-full object-cover"
              loading="lazy"
            />
          </figure>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              { role: t.pedigree.sire, name: t.pedigree.sireName, line: t.pedigree.sireLine },
              { role: t.pedigree.dam, name: t.pedigree.damName, line: t.pedigree.damLine },
            ].map((parent) => (
              <div key={parent.role} className="glass rounded-2xl px-6 py-5">
                <p className="text-[0.62rem] uppercase tracking-[0.24em] text-bronze/85">{parent.role}</p>
                <p className="font-display mt-2 text-2xl">{parent.name}</p>
                <p className="mt-1.5 text-sm text-bone/54">{parent.line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────── people ─────────────────────────── */}
      <section id="people" className="px-5 pb-24 md:px-8 md:pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <p className="eyebrow">{t.people.eyebrow}</p>
              <h2 className="font-display mt-5 whitespace-pre-line text-4xl leading-[1.04] md:text-6xl">
                {t.people.title}
              </h2>
            </div>
            <p className="self-end leading-relaxed text-bone/64">{t.people.lead}</p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {t.people.members.map((member) => (
              <article key={member.name} className="glass rounded-[1.4rem] p-7">
                <h3 className="font-display text-2xl">{member.name}</h3>
                <p className="mt-1.5 text-[0.62rem] uppercase tracking-[0.2em] text-bronze/85">{member.role}</p>
                <p className="mt-4 text-sm leading-relaxed text-bone/56">{member.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────── enquiry ─────────────────────────── */}
      <section id="enquire" className="relative overflow-hidden px-5 pb-28 md:px-8 md:pb-36">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="eyebrow">{t.enquiry.eyebrow}</p>
            <h2 className="font-display mx-auto mt-5 max-w-3xl whitespace-pre-line text-4xl leading-[1.04] md:text-6xl">
              {t.enquiry.title}
            </h2>
            <p className="mx-auto mt-6 max-w-xl leading-relaxed text-bone/58">{t.enquiry.lead}</p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
            <LeadForm lang={lang} />

            <aside className="glass flex flex-col justify-center rounded-[1.4rem] p-7 text-center">
              <p className="text-[0.62rem] uppercase tracking-[0.24em] text-bronze/85">
                {t.enquiry.call}
              </p>
              <a
                href={telHref}
                className="font-display mt-3 text-3xl leading-tight text-bone transition-colors hover:text-bronze-bright md:text-4xl"
              >
                {phone}
              </a>
              <p className="mt-4 text-xs leading-relaxed text-bone/45">{t.enquiry.callHint}</p>
              <a href={telHref} className="btn-primary mt-6">
                {t.enquiry.call}
              </a>
            </aside>
          </div>
        </div>
      </section>

      <footer className="border-t border-bone/8 px-5 py-12 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="" className="h-10 w-10" />
            <div>
              <p className="font-display text-xl">Del Cani Terezzine</p>
              <p className="text-[0.64rem] uppercase tracking-[0.18em] text-bone/40">{t.footer.address}</p>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 text-sm text-bone/52 md:items-end">
            <a href={telHref} className="transition-colors hover:text-bronze-bright">
              {phone}
            </a>
            <a href={`mailto:${email}`} className="transition-colors hover:text-bronze-bright">
              {email}
            </a>
            <p className="text-[0.62rem] uppercase tracking-[0.18em] text-bone/30">
              © {new Date().getFullYear()} Del Cani Terezzine. {t.footer.rights}
            </p>
          </div>
        </div>
      </footer>

      {lightbox ? (
        <button
          type="button"
          aria-label="Close"
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-obsidian/92 p-4 backdrop-blur-sm md:p-10"
        >
          <figure className="max-h-full max-w-4xl overflow-hidden rounded-[1.4rem] border border-bone/12">
            <img src={lightbox.src} alt={lightbox.caption} className="max-h-[80vh] w-full object-contain" />
            {lightbox.caption ? (
              <figcaption className="bg-graphite px-5 py-3 text-center text-sm text-bone/70">
                {lightbox.caption}
              </figcaption>
            ) : null}
          </figure>
        </button>
      ) : null}
    </main>
  )
}

function LeadForm({ lang }: { readonly lang: Lang }) {
  const t = dictionaries[lang].enquiry
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'failed'>('idle')
  const [errors, setErrors] = useState<FormErrors>({})
  const [notice, setNotice] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'sending') return

    const form = event.currentTarget
    const data = { ...Object.fromEntries(new FormData(form).entries()), lang }

    setStatus('sending')
    setErrors({})
    setNotice('')

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const payload = await response.json()

      if (!response.ok) {
        setErrors(payload.errors ?? {})
        if (!payload.errors) setNotice(t.errors.generic)
        setStatus('failed')
        return
      }

      setStatus('done')
      form.reset()
    } catch {
      setNotice(t.errors.network)
      setStatus('failed')
    }
  }

  if (status === 'done') {
    return (
      <div className="glass flex flex-col items-center justify-center rounded-[1.4rem] p-10 text-center">
        <h3 className="font-display text-3xl md:text-4xl">{t.doneTitle}</h3>
        <p className="mt-4 max-w-sm leading-relaxed text-bone/60">{t.doneBody}</p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-7 text-[0.66rem] uppercase tracking-[0.24em] text-bone/50 transition-colors hover:text-bronze-bright"
        >
          {t.doneAgain}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-[1.4rem] p-6 md:p-8" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="eyebrow">{t.firstName}</span>
          <input
            name="firstName"
            autoComplete="given-name"
            className={`field mt-2 ${errors.firstName ? 'field-error' : ''}`}
          />
          {errors.firstName ? <span className="mt-1.5 block text-xs text-[#e2837a]">{t.errors.firstName}</span> : null}
        </label>

        <label className="block">
          <span className="eyebrow">{t.lastName}</span>
          <input
            name="lastName"
            autoComplete="family-name"
            className={`field mt-2 ${errors.lastName ? 'field-error' : ''}`}
          />
          {errors.lastName ? <span className="mt-1.5 block text-xs text-[#e2837a]">{t.errors.lastName}</span> : null}
        </label>
      </div>

      <label className="mt-4 block">
        <span className="eyebrow">{t.phone}</span>
        <input
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+380 __ ___ __ __"
          className={`field mt-2 ${errors.phone ? 'field-error' : ''}`}
        />
        {errors.phone ? <span className="mt-1.5 block text-xs text-[#e2837a]">{t.errors.phone}</span> : null}
      </label>

      <label className="mt-4 block">
        <span className="eyebrow">{t.note}</span>
        <textarea name="note" rows={3} className="field mt-2 resize-none" placeholder={t.notePlaceholder} />
      </label>

      {/* Hidden from people, irresistible to bots. */}
      <input name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute h-0 w-0 -z-10 opacity-0" />

      {notice ? <p className="mt-4 text-sm text-[#e2837a]">{notice}</p> : null}

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
        <button type="submit" disabled={status === 'sending'} className="btn-primary">
          {status === 'sending' ? t.sending : t.submit}
        </button>
        <p className="text-xs leading-relaxed text-bone/42">{t.consent}</p>
      </div>
    </form>
  )
}
