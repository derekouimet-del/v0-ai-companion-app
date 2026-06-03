import type { Metadata, Viewport } from 'next'
import { Outfit, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-sans"
});
const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-mono"
});

export const viewport: Viewport = {
  themeColor: '#1a1a2e',
}

export const metadata: Metadata = {
  title: 'Mindy - Your AI Companion',
  description: 'Meet Mindy, your personal AI companion for meaningful conversations',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
