import './globals.css';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import Navbar from '@/components/navbar';
import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AnonHost',
  description: 'Free and Anonymous file hosting',
  icons: {
    icon: '/hero.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={cn(
          'w-full min-h-screen bg-background dark:bg-grid-white/[0.1] bg-grid-black/[0.1] overflow-y-auto',
          inter.className,
        )}
      >
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] opacity-80" />
        </div>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="container mx-auto px-4 py-8 flex-1">
              {children}
            </main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
