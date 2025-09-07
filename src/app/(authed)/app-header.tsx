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
import { mockUsers } from '@/lib/data'; // We'll still use this for the base structure for now
import { auth } from '@/lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import type { User } from '@/lib/types';


export default function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<User | null>(null);
  
  const [activeProfile, setActiveProfile] = useState<{ id: string; name: string, role: string } | null>(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUser(user);
        const foundUser = mockUsers.find(u => u.email === user.email);
        if (foundUser) {
            setAppUser(foundUser);
            setActiveProfile({ id: foundUser.id, name: foundUser.displayName, role: foundUser.role });
        } else {
            // Handle case where user exists in Firebase Auth but not in our mock data
             setAppUser(null);
             setActiveProfile(null);
             router.push('/login');
        }
      } else {
        setFirebaseUser(null);
        setAppUser(null);
        setActiveProfile(null);
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);


  const linkedProfiles = [
      { id: 'child_1', name: 'Hugo (Enfant)', role: 'player' },
      { id: 'child_2', name: 'Juliette (Enfant)', role: 'player' },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const switchProfile = (profile: {id: string, name: string, role: string}) => {
      setActiveProfile(profile);
      console.log("Switching to profile:", profile.name);
      router.refresh();
  }

  if (pathname.includes('/chat')) {
    return null;
  }
  
  if (!activeProfile) {
    return (
        <header className="bg-card text-foreground p-4 flex justify-between items-center sticky top-0 z-10 border-b border-white/10">
             <h1 className="text-xl font-bold">Chargement...</h1>
        </header>
    )
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
             {appUser && (
                 <DropdownMenuItem onClick={() => switchProfile({id: appUser.id, name: appUser.displayName, role: appUser.role })}>
                    {activeProfile.id === appUser.id && <Check className="mr-2 h-4 w-4" />}
                    {appUser.displayName} (Moi)
                </DropdownMenuItem>
             )}
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