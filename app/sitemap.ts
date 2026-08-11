import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://delcaniterezzine.com'
  return [
    {
      url: base,
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages: {
          en: base,
          uk: `${base}?lang=uk`,
          ru: `${base}?lang=ru`,
        },
      },
    },
  ]
}
