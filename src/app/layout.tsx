import type { Metadata, Viewport } from 'next'
import './globals.css'
import InstallPrompt from "@/components/shared/InstallPrompt";
import OfflineIndicator from "@/components/shared/OfflineIndicator";
import HtmlLangUpdater from "@/components/shared/HtmlLangUpdater";
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata: Metadata = {
  title: 'Cervical Cancer Care',
  description: 'Comprehensive cervical cancer patient management and care platform',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CC Care',
  },
}

export const viewport: Viewport = {
  themeColor: '#2563eb',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <LanguageProvider>
          <HtmlLangUpdater />
          {children}
          <InstallPrompt />
          <OfflineIndicator />
        </LanguageProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                      console.log('SW registered:', registration);
                    })
                    .catch((error) => {
                      console.error('SW registration failed:', error);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
