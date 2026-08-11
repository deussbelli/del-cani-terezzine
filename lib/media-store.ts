import { promises as fs } from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

export type MediaKind = 'photo' | 'video'

export type MediaItem = {
  id: string
  kind: MediaKind
  /** Public URL, always under /dogs (shipped) or /uploads (added via admin). */
  src: string
  caption: string
  /** Present for uploads so the file can be deleted with the record. */
  file?: string
  addedAt: string
}

const STORE = path.join(process.cwd(), 'data', 'media.json')
export const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

export const PHOTO_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/avif': '.avif',
}

export const VIDEO_TYPES: Record<string, string> = {
  'video/mp4': '.mp4',
  'video/webm': '.webm',
  'video/quicktime': '.mov',
}

export const MAX_PHOTO_BYTES = 12 * 1024 * 1024
export const MAX_VIDEO_BYTES = 120 * 1024 * 1024

/** The photographs that ship with the repo. Always shown, cannot be deleted. */
const SHIPPED: MediaItem[] = [
  { id: 'shipped-sentinel', kind: 'photo', src: '/dogs/sentinel.webp', caption: 'Ahiles — evening watch on the old wall', addedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'shipped-ramparts', kind: 'photo', src: '/dogs/ramparts.webp', caption: 'Standing the ramparts at blue hour', addedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'shipped-drive', kind: 'photo', src: '/dogs/drive.webp', caption: 'Drive through shallow water', addedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'shipped-high-guard', kind: 'photo', src: '/dogs/high-guard.webp', caption: 'Above the town, holding position', addedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'shipped-river-watch', kind: 'photo', src: '/dogs/river-watch.webp', caption: 'River watch — full profile', addedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'shipped-salt-flats', kind: 'photo', src: '/dogs/salt-flats.webp', caption: 'Sitting the salt flats', addedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'shipped-repose', kind: 'photo', src: '/dogs/repose.webp', caption: 'Repose on white', addedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'shipped-falls', kind: 'photo', src: '/dogs/falls.webp', caption: 'Resting at the falls', addedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'shipped-harbour', kind: 'photo', src: '/dogs/harbour.webp', caption: 'Harbour morning, play bow', addedAt: '2026-01-01T00:00:00.000Z' },
]

function sanitize(item: unknown): MediaItem | null {
  const raw = item as Partial<MediaItem>
  if (!raw || typeof raw !== 'object') return null
  if (raw.kind !== 'photo' && raw.kind !== 'video') return null
  if (typeof raw.src !== 'string') return null
  // Only ever serve paths we produced ourselves.
  if (!/^\/(uploads|dogs)\/[A-Za-z0-9._-]+$/.test(raw.src)) return null
  return {
    id: typeof raw.id === 'string' ? raw.id : randomUUID(),
    kind: raw.kind,
    src: raw.src,
    caption: typeof raw.caption === 'string' ? raw.caption.slice(0, 160) : '',
    file: typeof raw.file === 'string' && /^[A-Za-z0-9._-]+$/.test(raw.file) ? raw.file : undefined,
    addedAt: typeof raw.addedAt === 'string' ? raw.addedAt : new Date().toISOString(),
  }
}

async function readUploaded(): Promise<MediaItem[]> {
  try {
    const parsed = JSON.parse(await fs.readFile(STORE, 'utf8'))
    if (!Array.isArray(parsed)) return []
    return parsed.map(sanitize).filter((item): item is MediaItem => item !== null)
  } catch {
    return []
  }
}

async function writeUploaded(items: MediaItem[]) {
  await fs.mkdir(path.dirname(STORE), { recursive: true })
  await fs.writeFile(STORE, `${JSON.stringify(items, null, 2)}\n`, 'utf8')
}

/** Shipped photographs first, then whatever the kennel has added since. */
export async function listMedia() {
  const uploaded = await readUploaded()
  const all = [...SHIPPED, ...uploaded]
  return {
    photos: all.filter((item) => item.kind === 'photo'),
    videos: all.filter((item) => item.kind === 'video'),
    uploaded,
  }
}

export async function addMedia(entry: {
  kind: MediaKind
  file: string
  caption: string
}): Promise<MediaItem> {
  const uploaded = await readUploaded()
  const item: MediaItem = {
    id: randomUUID(),
    kind: entry.kind,
    src: `/uploads/${entry.file}`,
    file: entry.file,
    caption: entry.caption.slice(0, 160),
    addedAt: new Date().toISOString(),
  }
  await writeUploaded([item, ...uploaded])
  return item
}

export async function removeMedia(id: string): Promise<boolean> {
  const uploaded = await readUploaded()
  const target = uploaded.find((item) => item.id === id)
  if (!target) return false

  await writeUploaded(uploaded.filter((item) => item.id !== id))
  if (target.file) {
    // Best effort: the record is gone either way.
    await fs.rm(path.join(UPLOAD_DIR, target.file), { force: true }).catch(() => undefined)
  }
  return true
}
