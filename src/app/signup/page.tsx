
import { SignupForm } from "@/components/auth-forms";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-6">
       <div className="w-full max-w-sm">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary">Créer un compte</h1>
            <p className="text-muted-foreground">Rejoignez l'Étoile Sportive Doubs</p>
        </div>

        <SignupForm />
        
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
