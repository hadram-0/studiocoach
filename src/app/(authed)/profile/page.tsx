import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="p-4">
      <Card className="text-center">
        <CardHeader>
          <UserCircle className="mx-auto h-12 w-12 text-muted-foreground" />
          <CardTitle>Page Profil</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Cette section est en cours de construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
