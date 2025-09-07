"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { Loader2, Sparkles, Users } from "lucide-react";

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
import { Switch } from "./ui/switch";

const eventSchema = z.object({
  title: z.string().min(3, { message: "Le titre doit contenir au moins 3 caractères." }),
  type: z.enum(['Match', 'Entraînement', 'Réunion', 'Autre']),
  date: z.string().refine((val) => val && !isNaN(Date.parse(val)), { message: "La date et l'heure sont requises." }),
  location: z.string().min(3, { message: "Le lieu est requis." }),
  details: z.string().optional(),
  responseDeadline: z.string().optional(),
  guestsVisible: z.boolean().default(true),
});

const initialState: {
    success: boolean;
    suggestedLocation?: string;
    reasoning?: string;
    error?: string;
} = {
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
      responseDeadline: "none",
      guestsVisible: true,
    },
  });
  
  useEffect(() => {
    if (suggestionState.success && suggestionState.suggestedLocation) {
        form.setValue("location", suggestionState.suggestedLocation);
        toast({
            title: "Suggestion IA",
            description: suggestionState.reasoning,
        });
    }
    if (!suggestionState.success && suggestionState.error) {
        toast({
            variant: "destructive",
            title: "Erreur de suggestion",
            description: suggestionState.error,
        });
    }
  }, [suggestionState, form, toast]);


  async function onSubmit(values: z.infer<typeof eventSchema>) {
    setLoading(true);
    // Mock event creation
    console.log("Creating event:", values);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, you would get the new event ID from the backend
    const newEventId = `evt_${Date.now()}`; 

    toast({
      title: "Événement sauvegardé !",
      description: "Passez à l'étape suivante pour inviter les joueurs.",
    });

    // Redirect to the new invite page
    router.push(`/events/${newEventId}/invite`);
  }

  const handleSuggestion = () => {
    const formData = new FormData();
    const eventType = form.getValues("type");
    if(eventType) {
        formData.append("eventType", eventType);
        formAction(formData);
    } else {
        toast({
            variant: "destructive",
            title: "Type d'événement manquant",
            description: "Veuillez d'abord sélectionner un type d'événement.",
        });
    }
  };


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
                <Button type="button" variant="outline" onClick={handleSuggestion} className="shrink-0" aria-label="Suggérer un lieu">
                    <Sparkles className="h-4 w-4" />
                </Button>
              </div>
              {suggestionState.reasoning && !suggestionState.error && (
                  <FormDescription>
                    {suggestionState.reasoning}
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
        
        <FormField
          control={form.control}
          name="responseDeadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Délai de réponse</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Définir un délai pour la réponse..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Sans limite</SelectItem>
                  <SelectItem value="1h">1 heure avant</SelectItem>
                  <SelectItem value="2h">2 heures avant</SelectItem>
                  <SelectItem value="3h">3 heures avant</SelectItem>
                  <SelectItem value="6h">6 heures avant</SelectItem>
                  <SelectItem value="12h">12 heures avant</SelectItem>
                  <SelectItem value="24h">24 heures avant</SelectItem>
                  <SelectItem value="48h">48 heures avant</SelectItem>
                  <SelectItem value="72h">72 heures avant</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Les joueurs seront notifiés si leur réponse est attendue.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="guestsVisible"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel className="flex items-center"><Users className="mr-2 h-4 w-4"/>Liste des invités visible</FormLabel>
                <FormDescription>
                  Si activé, les joueurs invités pourront voir qui d'autre est invité.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" variant="destructive" className="w-full" disabled={loading}>
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sauvegarde...</> : "Suivant : Inviter les joueurs"}
        </Button>
      </form>
    </Form>
  );
}
