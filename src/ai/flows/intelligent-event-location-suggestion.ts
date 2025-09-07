'use server';
/**
 * @fileOverview Implements the intelligent event location suggestion flow.
 *
 * - suggestEventLocation - A function that suggests an event location based on event type and past history.
 * - SuggestEventLocationInput - The input type for the suggestEventLocation function.
 * - SuggestEventLocationOutput - The return type for the suggestEventLocation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestEventLocationInputSchema = z.object({
  eventType: z
    .string()
    .describe('The type of event (e.g., Match, Training, Meeting).'),
  pastEventHistory: z
    .string()
    .describe(
      'A summary of past event locations and their suitability for different event types.'
    ),
});
export type SuggestEventLocationInput = z.infer<
  typeof SuggestEventLocationInputSchema
>;

const SuggestEventLocationOutputSchema = z.object({
  suggestedLocation: z
    .string()
    .describe('The suggested event location based on the event type and past history.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the location suggestion.'),
});
export type SuggestEventLocationOutput = z.infer<
  typeof SuggestEventLocationOutputSchema
>;

export async function suggestEventLocation(
  input: SuggestEventLocationInput
): Promise<SuggestEventLocationOutput> {
  return suggestEventLocationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestEventLocationPrompt',
  input: {schema: SuggestEventLocationInputSchema},
  output: {schema: SuggestEventLocationOutputSchema},
  prompt: `You are an AI assistant helping a coach find the best location for their event.

  Based on the event type: {{{eventType}}} and the following past event history:
  {{{pastEventHistory}}}

  Suggest a suitable location and explain your reasoning.

  Ensure that the suggested location is practical and relevant to the event type.
  Consider factors such as the availability of facilities, accessibility, and suitability for the event.
  If there is no data in the past event history, suggest a generic location appropriate to the event type.
  `,
});

const suggestEventLocationFlow = ai.defineFlow(
  {
    name: 'suggestEventLocationFlow',
    inputSchema: SuggestEventLocationInputSchema,
    outputSchema: SuggestEventLocationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
