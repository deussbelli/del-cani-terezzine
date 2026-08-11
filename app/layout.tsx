import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'

const display = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-display-loaded',
  display: 'swap',
})

const sans = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans-loaded',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Del Cani Terezzine — Cane Corso Italiano kennel',
  description:
    'A small Cane Corso Italiano kennel in Ukraine. UKFU-registered, health-tested parents, certified pedigree with every puppy.',
  keywords: ['cane corso', 'cane corso italiano', 'kennel', 'puppies', 'UKFU', 'Ukraine'],
  icons: { icon: '/logo.svg' },
  openGraph: {
    title: 'Del Cani Terezzine — Cane Corso Italiano kennel',
    description: 'Few litters, nothing hurried. Certified pedigree with every puppy.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#08080a',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
