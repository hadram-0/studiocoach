import CreateEventForm from "@/components/create-event-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getAllTeamsWithMembers } from "@/lib/data";

export default async function CreateEventPage() {
  const teamsWithMembers = await getAllTeamsWithMembers();

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <Button asChild variant="ghost" size="icon" className="mr-2">
            <Link href="/dashboard" aria-label="Retour au tableau de bord">
                <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
        </Button>
        <h2 className="text-2xl font-bold text-gray-800">Créer un événement</h2>
      </div>

      <CreateEventForm teams={teamsWithMembers} />
    </div>
  );
}
