"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFormState } from "react-dom";
import { Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getLocationSuggestion } from "@/lib/actions";

const eventSchema = z.object({
  title: z.string().min(3, { message: "Le titre doit contenir au moins 3 caractères." }),
  type: z.enum(['Match', 'Entraînement', 'Réunion', 'Autre']),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Date et heure invalides." }),
  location: z.string().min(3, { message: "Le lieu est requis." }),
  details: z.string().optional(),
});

const initialState = {
  success: false,
  suggestedLocation: undefined,
  reasoning: undefined,
  error: undefined,
};

export default function CreateEventForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [suggestionState, formAction] = useFormState(getLocationSuggestion, initialState);

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      type: "Match",
      location: "",
      details: "",
    },
  });

  async function onSubmit(values: z.infer<typeof eventSchema>) {
    setLoading(true);
    // Mock event creation
    console.log("Creating event:", values);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Événement créé !",
      description: "Votre événement a été ajouté au calendrier.",
    });
    router.push("/dashboard");
    setLoading(false);
  }

  const handleSuggestion = () => {
    const formData = new FormData();
    formData.append("eventType", form.getValues("type"));
    formAction(formData);
  };
  
  // Effect to update form value when suggestion arrives
  useState(() => {
    if (suggestionState.success && suggestionState.suggestedLocation) {
        form.setValue("location", suggestionState.suggestedLocation);
    }
    if (!suggestionState.success && suggestionState.error) {
        toast({
            variant: "destructive",
            title: "Erreur de suggestion",
            description: suggestionState.error,
        });
    }
  });


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Match amical" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type d'événement" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Match">Match</SelectItem>
                  <SelectItem value="Entraînement">Entraînement</SelectItem>
                  <SelectItem value="Réunion">Réunion</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date et Heure</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lieu</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                    <Input placeholder="Stade René Viennet" {...field} />
                </FormControl>
                <Button type="button" variant="outline" onClick={handleSuggestion} className="shrink-0">
                    <Sparkles className="h-4 w-4" />
                    <span className="sr-only">Suggérer un lieu</span>
                </Button>
              </div>
              {suggestionState.success && suggestionState.reasoning && (
                  <FormDescription>
                    <strong>Suggestion IA:</strong> {suggestionState.reasoning}
                  </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Détails (facultatif)</FormLabel>
              <FormControl>
                <Textarea placeholder="Rendez-vous, équipement, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="destructive" className="w-full" disabled={loading}>
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Création...</> : "Créer l'événement"}
        </Button>
      </form>
    </Form>
  );
}
