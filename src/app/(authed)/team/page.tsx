import { mockUser, getUserTeams, getTeamMembers } from "@/lib/data";
import type { Team, TeamMember } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageSquare, BarChartHorizontal } from "lucide-react";

export default async function TeamPage() {
  const user = mockUser;
  const teams = await getUserTeams(user.id);

  return (
    <div className="p-4 space-y-4">
      {teams.map(async (team) => {
        const members = await getTeamMembers(team.id);
        return <TeamCard key={team.id} team={team} members={members} />;
      })}
    </div>
  );
}

function TeamCard({ team, members }: { team: Team; members: TeamMember[] }) {
    const roleLabels = {
        'coach': 'Coach',
        'admin': 'Admin',
        'player': 'Joueur',
    }
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{team.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {members.map((member) => (
          <div key={member.id} className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>{member.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-800">{member.displayName}</p>
              <p className="text-sm text-gray-500 capitalize">{roleLabels[member.role] || member.role}</p>
            </div>
          </div>
        ))}

        <div className="grid grid-cols-2 gap-2 pt-4 border-t">
            <Button asChild variant="outline">
                <Link href={`/team/${team.id}/chat`}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Messagerie
                </Link>
            </Button>
             <Button asChild>
                <Link href={`/team/${team.id}/stats`}>
                    <BarChartHorizontal className="mr-2 h-4 w-4" />
                    Statistiques
                </Link>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
