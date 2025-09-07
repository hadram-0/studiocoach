"use client";

import AppHeader from "@/app/(authed)/app-header";
import BottomNav from "@/components/bottom-nav";
import { usePathname } from "next/navigation";


export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // If we are on the login page, we don't want to show the authenticated layout
  if (pathname === '/login') {
    return <>{children}</>;
  }
  
  return (
    <div className="flex flex-col h-full">
      <AppHeader />
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}
