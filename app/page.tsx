import KennelSite from '@/components/KennelSite'
import { listMedia } from '@/lib/media-store'

// The gallery must reflect whatever the kennel uploaded a moment ago.
export const dynamic = 'force-dynamic'

export default async function Page() {
  const { photos, videos } = await listMedia()

  return (
    <KennelSite
      photos={photos}
      videos={videos}
      phone={process.env.NEXT_PUBLIC_KENNEL_PHONE ?? '+38050987626'}
      email={process.env.NEXT_PUBLIC_KENNEL_EMAIL ?? 'hello@delcaniterezzine.org'}
    />
  )
}
