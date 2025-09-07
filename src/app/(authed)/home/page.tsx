import { getEvents, getAttendanceByEventId, getCurrentUser } from "@/lib/data";
import type { TeamEvent } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EventCard from "@/components/event-card";
import { BarChart, CalendarCheck, CalendarX } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const allEvents = await getEvents();
  const now = new Date();
  
  const upcomingEvents = allEvents.filter(e => e.startTime >= now);
  const nextEvent = upcomingEvents[0] || null;

  // Mock data for user's history for the sake of the component
  let userPresenceCount = 0;
  for(const event of allEvents) {
    const attendance = await getAttendanceByEventId(event.id);
    if(attendance.find(a => a.userId === user.id && a.status === 'present')) {
        userPresenceCount++;
    }
  }
  const totalEvents = allEvents.length;
  const presencePercentage = totalEvents > 0 ? Math.round((userPresenceCount / totalEvents) * 100) : 0;

  return (
    <div className="p-4 space-y-6">
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-gray-800">Bonjour, {user.displayName.split(' ')[0]} !</h1>
        <p className="text-muted-foreground">Ravis de vous revoir.</p>
      </div>

      {nextEvent && (
        <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-700">Prochain événement</h2>
            <EventCard event={nextEvent} />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Votre Historique</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-green-50 rounded-lg">
            <CalendarCheck className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{userPresenceCount}</p>
            <p className="text-sm text-muted-foreground">Présences</p>
          </div>
           <div className="p-4 bg-blue-50 rounded-lg">
            <BarChart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{presencePercentage}%</p>
            <p className="text-sm text-muted-foreground">Assiduité</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-destructive text-destructive-foreground">
        <Link href="/documents">
            <CardContent className="p-4">
                <h3 className="font-semibold">Nouveaux documents</h3>
                <p className="text-sm opacity-90">Consultez les derniers documents partagés par le club.</p>
            </CardContent>
        </Link>
      </Card>
    </div>
  );
}
