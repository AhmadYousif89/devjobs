import type { Metadata } from 'next';
import { Kumbh_Sans } from 'next/font/google';
import './globals.css';

import MainHeader from '@/components/header/header';

const kumbhSans = Kumbh_Sans({
  variable: '--font-kumbh-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Devjobs Web App',
  description: 'A job board for developers',
  icons: {
    icon: '/favicon-32x32.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${kumbhSans.variable} antialiased`}>
        <MainHeader />
        {children}
      </body>
    </html>
  );
}
