import { NextResponse } from 'next/server'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { isAuthenticatedRequest, unauthorized } from '@/lib/auth'
import {
  MAX_PHOTO_BYTES,
  MAX_VIDEO_BYTES,
  PHOTO_TYPES,
  UPLOAD_DIR,
  VIDEO_TYPES,
  addMedia,
  listMedia,
  removeMedia,
} from '@/lib/media-store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  if (!isAuthenticatedRequest(request)) return unauthorized()
  const { photos, videos, uploaded } = await listMedia()
  return NextResponse.json({ photos, videos, uploaded })
}

export async function POST(request: Request) {
  if (!isAuthenticatedRequest(request)) return unauthorized()

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Expected a multipart upload.' }, { status: 400 })
  }

  const file = form.get('file')
  const caption = String(form.get('caption') ?? '').replace(/\s+/g, ' ').trim().slice(0, 160)

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: 'Choose a file to upload.' }, { status: 400 })
  }

  // The declared MIME type decides both the bucket and the extension, so an
  // attacker cannot smuggle a .html through by renaming it.
  const isPhoto = file.type in PHOTO_TYPES
  const isVideo = file.type in VIDEO_TYPES
  if (!isPhoto && !isVideo) {
    return NextResponse.json(
      { error: 'Unsupported format. Photos: JPEG, PNG, WebP, AVIF. Video: MP4, WebM, MOV.' },
      { status: 415 },
    )
  }

  const limit = isPhoto ? MAX_PHOTO_BYTES : MAX_VIDEO_BYTES
  if (file.size > limit) {
    return NextResponse.json(
      { error: `That file is too large. Limit: ${Math.round(limit / 1024 / 1024)} MB.` },
      { status: 413 },
    )
  }

  const extension = isPhoto ? PHOTO_TYPES[file.type] : VIDEO_TYPES[file.type]
  const name = `${randomUUID()}${extension}`

  await fs.mkdir(UPLOAD_DIR, { recursive: true })
  await fs.writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()))

  const item = await addMedia({ kind: isPhoto ? 'photo' : 'video', file: name, caption })
  return NextResponse.json({ ok: true, item })
}

export async function DELETE(request: Request) {
  if (!isAuthenticatedRequest(request)) return unauthorized()

  const body = await request.json().catch(() => null)
  const id = typeof (body as { id?: unknown } | null)?.id === 'string' ? (body as { id: string }).id : ''
  if (!id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 })

  const removed = await removeMedia(id)
  if (!removed) {
    return NextResponse.json(
      { error: 'Not found. Photographs that ship with the site cannot be removed here.' },
      { status: 404 },
    )
  }
  return NextResponse.json({ ok: true })
}
