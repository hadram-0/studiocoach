"use server";

import { suggestEventLocation } from "@/ai/flows/intelligent-event-location-suggestion";
import { z } from "zod";

const SuggestionSchema = z.object({
  eventType: z.string(),
});

type SuggestionResult = {
  success: boolean;
  suggestedLocation?: string;
  reasoning?: string;
  error?: string;
};

export async function getLocationSuggestion(
  prevState: any,
  formData: FormData
): Promise<SuggestionResult> {
  const validatedFields = SuggestionSchema.safeParse({
    eventType: formData.get("eventType"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Type d'événement invalide.",
    };
  }

  const { eventType } = validatedFields.data;

  // In a real app, this would be dynamically fetched from your database
  const pastEventHistory = `
    - Match à domicile: Toujours au 'Stade René Viennet'.
    - Entraînements: Généralement au 'Stade René Viennet', sauf si mauvais temps, auquel cas c'est au 'Gymnase local'.
    - Réunions: Toujours au 'Club House', car il est équipé d'un projecteur.
    - Matchs importants: parfois au 'Stade Bonal' pour sa plus grande capacité.
  `;

  try {
    const result = await suggestEventLocation({
      eventType,
      pastEventHistory,
    });
    return { success: true, ...result };
  } catch (e) {
    console.error(e);
    return { success: false, error: "L'IA n'a pas pu suggérer de lieu." };
  }
}
