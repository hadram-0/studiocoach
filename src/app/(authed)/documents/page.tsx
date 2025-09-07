import { getCurrentUser, getDocumentsForUserTeams } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";

export default async function DocumentsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  const documentsByTeam = await getDocumentsForUserTeams(user.id);

  const hasDocuments = Object.values(documentsByTeam).some(docs => docs.length > 0);

  return (
    <div className="p-4 space-y-6">
      {hasDocuments ? (
         Object.entries(documentsByTeam).map(([teamName, documents]) => (
            documents.length > 0 && (
                <Card key={teamName}>
                    <CardHeader>
                        <CardTitle>{teamName}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {documents.map(doc => (
                            <Link href={doc.url} key={doc.id} target="_blank" rel="noopener noreferrer" className="block">
                                <div className="flex items-center p-3 border rounded-lg hover:bg-accent transition-colors">
                                    <FileText className="h-5 w-5 mr-3 text-destructive" />
                                    <span className="flex-1 font-medium text-sm">{doc.fileName}</span>
                                    <Badge variant="outline">{doc.category}</Badge>
                                </div>
                            </Link>
                        ))}
                    </CardContent>
                </Card>
            )
        ))
      ) : (
        <Card>
            <CardHeader>
                <CardTitle>Aucun document</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Aucun document n'a été partagé avec vos équipes pour le moment.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
