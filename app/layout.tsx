import type { Metadata, Viewport } from 'next'
import '@fontsource/space-grotesk/400.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/700.css'
import './globals.css'
import { StoreProvider } from '@/lib/store'

export const viewport: Viewport = {
  themeColor: '#FFD93D',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: 'Campus Voice · Real-Time Campus Updates',
    template: '%s · Campus Voice',
  },
  description: 'Verified, noise-free announcements, exams, and event updates for students, faculty, and administration.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Campus Voice · Real-Time Campus Updates',
    description: 'Verified, noise-free announcements, exams, and event updates for university campuses.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  )
}


