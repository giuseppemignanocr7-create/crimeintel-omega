import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CrimeIntel 7.0 Ω — Forensic Intelligence Platform',
  description: 'Advanced forensic intelligence and evidence management platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-ci-bg text-ci-text antialiased">
        {children}
      </body>
    </html>
  );
}
