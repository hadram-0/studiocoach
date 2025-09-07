"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Users, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: CalendarDays, label: "Calendrier" },
  { href: "/team", icon: Users, label: "Équipe" },
  { href: "/profile", icon: UserCircle, label: "Profil" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-card border-t z-10">
      <div className="flex justify-around p-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full rounded-lg py-1 transition-colors duration-200",
                isActive ? "text-primary" : "text-gray-400 hover:text-primary"
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
