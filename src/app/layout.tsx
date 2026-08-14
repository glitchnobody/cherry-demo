import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { AccessGate } from './access-gate';
import { Analytics } from '@vercel/analytics/next';
import { GoogleTagManager } from '@next/third-parties/google';
import './globals.css';

const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.VERCEL_PROJECT_PRODUCTION_URL ??
  process.env.VERCEL_URL;

const siteUrl = configuredSiteUrl
  ? configuredSiteUrl.startsWith('http')
    ? configuredSiteUrl
    : `https://${configuredSiteUrl}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Demo',
  description: 'Project Cherry Demo',
  openGraph: {
    title: 'Demo',
    description: 'Project Cherry Demo',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Demo',
    description: 'Project Cherry Demo',
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang='en' className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <Analytics />
        <GoogleTagManager gtmId='GTM-KGDPBKKH' />
        <AccessGate>{children}</AccessGate>
      </body>
    </html>
  );
}
