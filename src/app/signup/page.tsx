import { SignupForm } from "@/components/auth-forms";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupPage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-6">
       <div className="w-full max-w-sm">
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-2xl text-primary">Créer un compte</CardTitle>
                <CardDescription>Rejoignez l'Étoile Sportive Doubs</CardDescription>
            </CardHeader>
            <CardContent>
                <SignupForm />
            </CardContent>
        </Card>
        
        <p className="text-center text-muted-foreground text-sm mt-6">
            Déjà un compte ?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
                Connectez-vous
            </Link>
        </p>
        </div>
    </div>
  );
}
