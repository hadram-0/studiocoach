import EventCard from "@/components/event-card";
import { getEvents, mockUser } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TeamEvent } from "@/lib/types";

export default async function DashboardPage() {
  const allEvents = await getEvents();
  const user = mockUser; // In a real app, get the current user

  const now = new Date();
  const upcomingEvents = allEvents.filter(e => e.startTime >= now);
  const pastEvents = allEvents.filter(e => e.startTime < now);


  return (
    <div className="p-4">
      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="upcoming">À venir</TabsTrigger>
          <TabsTrigger value="past">Passés</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
            <EventList events={upcomingEvents} emptyMessage="Il n'y a pas d'événements à venir pour le moment." />
        </TabsContent>
        <TabsContent value="past">
            <EventList events={pastEvents} emptyMessage="Aucun événement passé." />
        </TabsContent>
      </Tabs>

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


function EventList({ events, emptyMessage }: { events: TeamEvent[], emptyMessage: string }) {
    if (events.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Aucun événement</CardTitle>
                    <CardDescription>{emptyMessage}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Les nouveaux événements créés par votre coach apparaîtront ici.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            {events.map((event) => (
                <EventCard key={event.id} event={event} />
            ))}
        </div>
    )
}
