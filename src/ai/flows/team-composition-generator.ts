'use server';
/**
 * @fileOverview A team composition image generator.
 *
 * - generateTeamComposition - A function that handles the team composition generation.
 * - GenerateTeamCompositionInput - The input type for the generateTeamComposition function.
 * - GenerateTeamCompositionOutput - The return type for the generateTeamComposition function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTeamCompositionInputSchema = z.object({
  playerList: z.string().describe("A list of player names, separated by commas."),
  formationDescription: z.string().describe("A textual description of the desired formation (e.g., 'a 4-4-2 with Martin and Petit upfront')."),
});
export type GenerateTeamCompositionInput = z.infer<typeof GenerateTeamCompositionInputSchema>;

const GenerateTeamCompositionOutputSchema = z.object({
    imageUrl: z.string().describe("The data URI of the generated image showing the team composition on a soccer field."),
});
export type GenerateTeamCompositionOutput = z.infer<typeof GenerateTeamCompositionOutputSchema>;


export async function generateTeamComposition(input: GenerateTeamCompositionInput): Promise<GenerateTeamCompositionOutput> {
  const { media } = await ai.generate({
    model: 'googleai/imagen-4.0-fast-generate-001',
    prompt: `Generate a clear, top-down view of a soccer field. On this field, create a visual representation of a team lineup based on the following information.
    
    Available players: ${input.playerList}.
    
    Formation instructions: "${input.formationDescription}".
    
    Represent each player with a simple circle or jersey icon with their name written clearly below it. Arrange the players on the field according to the formation instructions. The final image should be a clear, easy-to-read tactical diagram.`,
    config: {
      aspectRatio: "16:9",
    }
  });

  if (!media.url) {
    throw new Error('Image generation failed');
  }

  return { imageUrl: media.url };
}
