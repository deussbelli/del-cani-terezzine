import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://delcaniterezzine.com'
  return {
    rules: [
      // The admin panel and the API are not for crawlers.
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
