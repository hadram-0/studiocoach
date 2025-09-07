"use client";

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export default function AppHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    // Mock logout
    await new Promise(resolve => setTimeout(resolve, 500));
    router.push('/login');
  };

  return (
    <header className="bg-primary text-primary-foreground p-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
      <h1 className="text-xl font-bold">ES Doubs</h1>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleLogout}
        className="hover:bg-white/20"
        aria-label="Déconnexion"
      >
        <LogOut className="h-6 w-6" />
      </Button>
    </header>
  );
}
