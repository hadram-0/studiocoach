import EventCard from "@/components/event-card";
import { getEvents, mockUser } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const events = await getEvents();
  const user = mockUser; // In a real app, get the current user

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Événements à venir</h2>

      {events.length > 0 ? (
        <div className="space-y-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Aucun événement</CardTitle>
            <CardDescription>Il n'y a pas d'événements à venir pour le moment.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Les nouveaux événements créés par votre coach apparaîtront ici.</p>
          </CardContent>
        </Card>
      )}

      {(user.role === 'coach' || user.role === 'admin') && (
        <Button asChild size="icon" className="fixed bottom-24 right-6 w-14 h-14 rounded-full shadow-lg transition-transform hover:scale-110" variant="destructive">
          <Link href="/events/create" aria-label="Créer un nouvel événement">
            <Plus className="h-7 w-7" />
          </Link>
        </Button>
      )}
    </div>
  );
}
