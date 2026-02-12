import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const metadata: Metadata = {
  title: 'CrimeIntel 7.0 Ω — Forensic Intelligence Platform',
  description: 'Advanced forensic intelligence and evidence management platform',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'CrimeIntel' },
  manifest: undefined,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0a0e1a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen min-h-[100dvh] bg-ci-bg text-ci-text antialiased overscroll-none">
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
