import { LoginForm } from "@/components/auth-forms";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-6 bg-cover bg-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary">Étoile Sportive</h1>
            <h2 className="text-4xl font-extrabold text-destructive">DOUBS</h2>
        </div>
        
        <LoginForm />

        <p className="text-center text-muted-foreground text-sm mt-6">
            Pas encore de compte ?{' '}
            <Link href="/signup" className="font-semibold text-destructive hover:underline">
                Inscrivez-vous
            </Link>
        </p>
      </div>
    </div>
  );
}
