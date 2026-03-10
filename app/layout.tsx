import type { Metadata } from 'next';
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces'
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta'
});

export const metadata: Metadata = {
  title: 'TaxPing — No portal. Just text.',
  description:
    'TaxPing helps tax preparers collect client documents over SMS without portals, apps, or passwords.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${fraunces.variable} ${jakarta.variable} bg-sand font-sans text-ink antialiased`}>
        {children}
      </body>
    </html>
  );
}
