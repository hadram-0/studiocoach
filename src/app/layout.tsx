import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'Doubs Coach',
  description: 'Gérez votre équipe de football',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#004793" />
      </head>
      <body className="font-body antialiased bg-background h-full">
        <div className="relative max-w-lg mx-auto bg-card h-full min-h-[100dvh] flex flex-col shadow-lg">
            {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
