import { mockUser, getUserTeams } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default async function ProfilePage() {
  const user = mockUser; // In a real app, you would get the logged-in user
  const userTeams = await getUserTeams(user.id);

  const initials = user.displayName.substring(0, 2).toUpperCase();
  const roleLabels: { [key: string]: string } = {
    'coach': 'Coach',
    'admin': 'Admin',
    'player': 'Joueur',
  };
  const role = roleLabels[user.role] || user.role;
  const teams = userTeams.map(t => t.name).join(', ');


  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader className="items-center text-center">
          <Avatar className="h-24 w-24 mb-2">
            <AvatarFallback className="text-4xl">{initials}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">{user.displayName}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="text-sm text-muted-foreground">
                <div className="flex justify-between py-2 border-b">
                    <span className="font-semibold text-card-foreground">Rôle</span>
                    <span className="capitalize">{role}</span>
                </div>
                <div className="flex justify-between py-2">
                    <span className="font-semibold text-card-foreground">Équipes</span>
                    <span>{teams}</span>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
