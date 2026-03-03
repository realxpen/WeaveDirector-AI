import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { WelcomeModal } from '@/components/WelcomeModal';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'WeaveDirector - AI Creative Director',
  description: 'Live multimodal AI creative director powered by Gemini.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="min-h-screen bg-zinc-950 text-zinc-50 font-sans antialiased selection:bg-blue-500/30" suppressHydrationWarning>
        <WelcomeModal />
        {children}
      </body>
    </html>
  );
}
