import { NextResponse } from 'next/server'
import { listMedia } from '@/lib/media-store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Public read so the gallery reflects admin uploads without a rebuild. */
export async function GET() {
  const { photos, videos } = await listMedia()
  return NextResponse.json({ photos, videos }, { headers: { 'Cache-Control': 'no-store' } })
}
