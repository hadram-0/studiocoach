"use client";

import { LogOut, Users, Check } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';
import { mockUser } from '@/lib/data'; // We'll still use this for the base structure for now
import { auth } from '@/lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';

export default function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  
  // Replace mock data with state derived from the firebase user
  const [activeProfile, setActiveProfile] = useState({ id: '', name: '...' });
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUser(user);
        // Find the matching user in our mock data to get role/teams info
        // In a real app, this would come from a 'users' collection in Firestore
        const appUser = mockUser; // Replace with a fetch to your user database
        setActiveProfile({ id: user.uid, name: appUser.displayName || user.email || "Utilisateur" });
      } else {
        setFirebaseUser(null);
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);


  const linkedProfiles = [
      { id: 'child_1', name: 'Hugo (Enfant)' },
      { id: 'child_2', name: 'Juliette (Enfant)' },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Logout failed", error);
      // Optionally: show an error toast to the user
    }
  };

  const switchProfile = (profile: {id: string, name: string}) => {
      setActiveProfile(profile);
      // In a real app, this would trigger a global state change and data refetching.
      // For now, we'll just log it and refresh the page to simulate.
      console.log("Switching to profile:", profile.name);
      router.refresh();
  }

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
    if (pathname.startsWith('/events/invite')) return 'Inviter des joueurs';
    if (pathname.startsWith('/events/')) return 'Détails';
    return 'ES Doubs';
  }

  const initials = activeProfile.name.substring(0, 2).toUpperCase();

  return (
    <header className="bg-card text-foreground p-4 flex justify-between items-center sticky top-0 z-10 border-b border-white/10">
      <h1 className="text-xl font-bold">{getTitle()}</h1>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 hover:bg-white/10 h-10 px-3">
             <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary-foreground text-primary font-bold">{initials}</AvatarFallback>
             </Avatar>
             <span className="hidden sm:inline">{activeProfile.name}</span>
             <Users className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>Changer de profil</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => switchProfile({id: firebaseUser!.uid, name: mockUser.displayName})}>
                {activeProfile.id === firebaseUser?.uid && <Check className="mr-2 h-4 w-4" />}
                {mockUser.displayName} (Moi)
            </DropdownMenuItem>
             {linkedProfiles.map(profile => (
                <DropdownMenuItem key={profile.id} onClick={() => switchProfile(profile)}>
                    {activeProfile.id === profile.id && <Check className="mr-2 h-4 w-4" />}
                    {profile.name}
                </DropdownMenuItem>
             ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Déconnexion</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </header>
  );
}
