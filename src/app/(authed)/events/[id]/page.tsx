import { getEventById, getAttendanceByEventId } from "@/lib/data";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Info, MapPin } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import EventDetailsClient from "@/components/event-details-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EventDetailsPage({ params }: { params: { id: string } }) {
  const event = await getEventById(params.id);

  if (!event) {
    notFound();
  }

  const initialAttendance = await getAttendanceByEventId(params.id);
  const { date, time } = formatEventDate(event.startTime);

  const badgeVariant = {
    'Match': 'destructive',
    'Entraînement': 'default',
    'Réunion': 'secondary',
    'Autre': 'outline',
  } as const;

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 flex items-center bg-card border-b sticky top-0 z-10">
          <Button asChild variant="ghost" size="icon" className="-ml-2 mr-2">
              <Link href="/dashboard" aria-label="Retour au tableau de bord">
                  <ArrowLeft className="h-6 w-6 text-gray-600" />
              </Link>
          </Button>
          <div className="flex-1 min-w-0">
              <Badge variant={badgeVariant[event.type] || 'default'} className="mb-1">{event.type}</Badge>
              <h2 className="text-xl font-bold text-gray-800 truncate">{event.title}</h2>
          </div>
      </header>

      <div className="p-4 space-y-4 flex-1">
        <Card>
            <CardContent className="p-4 space-y-2">
                <InfoItem icon={Calendar} content={`${date} ${time}`} />
                <InfoItem icon={MapPin} content={event.location || 'Non spécifié'} />
            </CardContent>
        </Card>

        {event.details && (
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center"><Info className="h-4 w-4 mr-2 text-muted-foreground" />Détails</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{event.details}</p>
                </CardContent>
            </Card>
        )}
        
        <EventDetailsClient eventId={event.id} initialAttendance={initialAttendance} />
      </div>
    </div>
  );
}

function formatEventDate(date: Date) {
    if (!date) return { date: '', time: '' };
    const optionsDate: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const optionsTime: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
    return {
      date: date.toLocaleDateString('fr-FR', optionsDate),
      time: `à ${date.toLocaleTimeString('fr-FR', optionsTime)}`,
    };
}

function InfoItem({ icon: Icon, content }: { icon: React.ElementType, content: string }) {
    return (
        <div className="flex items-center text-sm">
            <Icon className="h-4 w-4 mr-3 text-muted-foreground flex-shrink-0" />
            <span className="text-gray-700">{content}</span>
        </div>
    )
}
