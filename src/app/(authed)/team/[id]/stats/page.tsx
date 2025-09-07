import { getTeamById, getTeamStats } from "@/lib/data";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { UserStats } from "@/lib/types";

export default async function TeamStatsPage({ params }: { params: { id: string } }) {
  const team = await getTeamById(params.id);
  
  if (!team) {
    notFound();
  }

  const stats = await getTeamStats(params.id);

  // Trier par taux de présence décroissant
  const sortedStats = [...stats].sort((a, b) => b.attendanceRate - a.attendanceRate);

  return (
    <div className="p-4">
       <div className="flex items-center mb-4">
        <Button asChild variant="ghost" size="icon" className="mr-2">
            <Link href="/team" aria-label="Retour à la liste des équipes">
                <ArrowLeft className="h-6 w-6" />
            </Link>
        </Button>
        <h2 className="text-2xl font-bold">Statistiques de l'équipe</h2>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>{team.name}</CardTitle>
        </CardHeader>
        <CardContent>
            {sortedStats.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Joueur</TableHead>
                        <TableHead className="text-center">Présences</TableHead>
                        <TableHead className="text-center">Total</TableHead>
                        <TableHead className="text-center">Taux</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedStats.map((stat) => (
                            <TableRow key={stat.userId}>
                                <TableCell className="font-medium">{stat.displayName}</TableCell>
                                <TableCell className="text-center font-semibold text-green-600">{stat.eventsAttended || 0}</TableCell>
                                <TableCell className="text-center">{stat.totalEvents || 0}</TableCell>
                                <TableCell className={`text-center font-bold ${stat.attendanceRate >= 75 ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {(stat.attendanceRate || 0).toFixed(0)}%
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <p className="text-sm text-muted-foreground text-center p-4">Aucune statistique disponible pour cette équipe.</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
