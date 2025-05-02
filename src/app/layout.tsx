import type { Metadata } from 'next';
import { Inter_Tight, Inter } from 'next/font/google';
import '../styles/globals.css';
import localFont from 'next/font/local';

const Satoshi = localFont({
  src: '../../public/fonts/satoshi/Satoshi-Variable.woff2',
});

const InterFont = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const InterTight = Inter_Tight({
  variable: '--font-inter-tight',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'tamma',
  description: 'Deploy Lambda functions just by chatting.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${InterFont.variable} ${InterTight.variable} ${Satoshi.className}`}>
        {children}
      </body>
    </html>
  );
}
