import Link from "next/link";
import type { TeamEvent } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: TeamEvent;
}

export default function EventCard({ event }: EventCardProps) {
  const { date, time } = formatEventDate(event.startTime);

  const badgeVariant = {
    'Match': 'destructive',
    'Entraînement': 'default',
    'Réunion': 'secondary',
    'Autre': 'outline',
  } as const;


  return (
    <Link href={`/events/${event.id}`} className="block">
        <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-800 pr-2">{event.title}</h3>
                    <Badge variant={badgeVariant[event.type] || 'default'} className="whitespace-nowrap">{event.type}</Badge>
                </div>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{event.location || 'Lieu non spécifié'}</span>
                    </div>
                    <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{date}</span>
                    </div>
                    <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{time}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    </Link>
  );
}

function formatEventDate(date: Date) {
  if (!date) return { date: '', time: '' };
  const optionsDate: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const optionsTime: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
  return {
    date: date.toLocaleDateString('fr-FR', optionsDate),
    time: `à ${date.toLocaleTimeString('fr-FR', optionsTime)}`,
  };
}
