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
    - Match 1 (Stade René Viennet): Bon terrain, mais parking limité.
    - Entraînement 1 (Stade René Viennet): Idéal pour les séances techniques.
    - Réunion 1 (Club House): Bien équipé pour les réunions, projecteur disponible.
    - Match 2 (Stade Bonal): Grande capacité, terrain impeccable.
    - Entraînement 2 (Gymnase local): Option de repli en cas de mauvais temps.
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
