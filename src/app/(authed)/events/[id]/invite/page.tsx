import { getAllTeamsWithMembers, getEventById } from "@/lib/data";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import InvitePlayersForm from "@/components/invite-players-form";

export default async function InvitePlayersPage({ params }: { params: { id: string } }) {
  const event = await getEventById(params.id);
  const teamsWithMembers = await getAllTeamsWithMembers();
  
  // In a real app, you would probably want to check if the user has permission to invite to this event.
  // For now we'll simulate finding the newly created event.
  const displayEvent = event || { id: params.id, title: "Nouvel événement", type: "Match", startTime: new Date(), location: "A définir", teamId: ""};

  if (!displayEvent) {
    notFound();
  }

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <Button asChild variant="ghost" size="icon" className="mr-2">
            <Link href={`/events/create`} aria-label="Retour à l'étape précédente">
                <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
        </Button>
        <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">Inviter des joueurs (2/2)</h2>
            <p className="text-sm text-muted-foreground">Événement : {displayEvent.title}</p>
        </div>
      </div>
      <InvitePlayersForm teams={teamsWithMembers} eventId={displayEvent.id} />
    </div>
  );
}
