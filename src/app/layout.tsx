import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Page } from '@/components/page';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dash0 Coding Challenge',
  description: 'Display Logs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className + ' h-screen'}>
        <Page>{children}</Page>
      </body>
    </html>
  );
}
