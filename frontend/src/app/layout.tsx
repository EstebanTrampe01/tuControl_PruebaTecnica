import React from 'react';
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import { Navbar } from '../components/organisms/Navbar';
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'NovaTech Store',
  description: 'Sistema interno de gestión para NovaTech Store',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Navbar />
          <main className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
