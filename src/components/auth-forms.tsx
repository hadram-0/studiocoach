
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";


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
import { Alert, AlertDescription } from "./ui/alert";

// --- Login Form ---
const loginSchema = z.object({
  email: z.string().email({ message: "Adresse email invalide." }),
  password: z.string().min(1, { message: "Le mot de passe est requis." }),
});

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    // Mock authentication
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (values.email === "coach@esdoubs.fr" && values.password === "password") {
      router.push("/home");
    } else {
      setError("Email ou mot de passe incorrect.");
    }
    setLoading(false);
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
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Mot de passe oublié ?
            </Link>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Connexion..." : "Connexion"}
        </Button>
    </form>
    </Form>
  );
}
