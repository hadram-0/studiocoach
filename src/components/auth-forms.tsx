
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";


import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { useToast } from "@/hooks/use-toast";

// --- Login Form ---
const loginSchema = z.object({
  email: z.string().email({ message: "Adresse email invalide." }),
  password: z.string().min(1, { message: "Le mot de passe est requis." }),
});

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      router.push("/home");
    } catch (error: any) {
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setError("Email ou mot de passe incorrect.");
          break;
        default:
          setError("Une erreur est survenue lors de la connexion.");
          break;
      }
    }
    setLoading(false);
  }

  const handlePasswordReset = async () => {
    const email = form.getValues("email");
    if (!email) {
      form.setError("email", { type: "manual", message: "Veuillez d'abord saisir votre adresse e-mail." });
      return;
    }
    
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "E-mail envoyé !",
        description: "Vérifiez votre boîte de réception pour réinitialiser votre mot de passe.",
      });
    } catch (error: any) {
        console.error("Password reset error", error)
        toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible d'envoyer l'e-mail de réinitialisation. Veuillez vérifier l'adresse e-mail.",
        });
    } finally {
        setLoading(false);
    }
  }


  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
            <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
                <Input placeholder="votre@email.com" {...field} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />
        <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Mot de passe</FormLabel>
            <FormControl>
                <Input type="password" {...field} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />
         <div className="flex justify-end">
            <Button type="button" variant="link" onClick={handlePasswordReset} className="text-sm text-muted-foreground hover:text-primary transition-colors h-auto p-0">
                Mot de passe oublié ?
            </Button>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Connexion..." : "Connexion"}
        </Button>
    </form>
    </Form>
  );
}
