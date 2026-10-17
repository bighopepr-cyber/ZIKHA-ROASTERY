import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ZIKHA ROASTERY | Growing Goodness Through Coffee',
  description: 'Kopi pilihan dari petani lokal, disangrai segar dalam batch kecil di ZIKHA ROASTERY.',
  keywords: ['kopi', 'roastery', 'arabica', 'robusta', 'jasa roasting'],
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icon.svg', apple: '/icon.svg' },
  appleWebApp: { capable: true, title: 'ZIKHA ROASTERY', statusBarStyle: 'default' },
  openGraph: {
    title: 'ZIKHA ROASTERY | Growing Goodness Through Coffee',
    description: 'Kopi pilihan dari petani lokal, disangrai segar dalam batch kecil.',
    type: 'website',
    locale: 'id_ID',
  },
};

export const viewport: Viewport = {
  themeColor: '#f2efe8',
  colorScheme: 'light dark',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}