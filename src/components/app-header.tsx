"use client";

import { LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from './ui/button';

export default function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    // Mock logout
    await new Promise(resolve => setTimeout(resolve, 500));
    router.push('/login');
  };

  // Do not show main header on chat pages
  if (pathname.includes('/chat')) {
    return null;
  }

  const getTitle = () => {
    if (pathname.startsWith('/home')) return 'Accueil';
    if (pathname.startsWith('/dashboard')) return 'Calendrier';
    if (pathname.startsWith('/team')) return 'Équipes';
    if (pathname.startsWith('/documents')) return 'Documents';
    if (pathname.startsWith('/profile')) return 'Profil';
    if (pathname.startsWith('/events/create')) return 'Créer un événement';
    if (pathname.startsWith('/events/')) return 'Détails';
    return 'ES Doubs';
  }

  return (
    <header className="bg-card text-foreground p-4 flex justify-between items-center sticky top-0 z-10 border-b border-white/10">
      <h1 className="text-xl font-bold">{getTitle()}</h1>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleLogout}
        className="hover:bg-white/10"
        aria-label="Déconnexion"
      >
        <LogOut className="h-6 w-6" />
      </Button>
    </header>
  );
}
