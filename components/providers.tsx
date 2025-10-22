'use client';

import { PannaProvider } from 'panna-sdk';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PannaProvider
      clientId={process.env.NEXT_PUBLIC_PANNA_CLIENT_ID}
      partnerId={process.env.NEXT_PUBLIC_PANNA_PARTNER_ID}
    >
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
        <Toaster />
      </ThemeProvider>
    </PannaProvider>
  );
}
