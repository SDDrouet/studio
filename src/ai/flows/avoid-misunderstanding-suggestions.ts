'use server';

/**
 * @fileOverview This file defines a Genkit flow to analyze text and suggest phrases to avoid
 * that could lead to misunderstandings, along with suggested alternatives.
 *
 * - avoidMisunderstandingSuggestions - A function that handles the suggestion process.
 * - AvoidMisunderstandingSuggestionsInput - The input type for the avoidMisunderstandingSuggestions function.
 * - AvoidMisunderstandingSuggestionsOutput - The return type for the avoidMisunderstandingSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AvoidMisunderstandingSuggestionsInputSchema = z.object({
  text: z
    .string()
    .describe(
      'The text to analyze for potentially misunderstanding phrases.'
    ),
});
export type AvoidMisunderstandingSuggestionsInput = z.infer<typeof AvoidMisunderstandingSuggestionsInputSchema>;

const AvoidMisunderstandingSuggestionsOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      phraseToAvoid: z.string().describe('The phrase that could be misunderstood.'),
      suggestedAlternative: z.string().describe('A suggested alternative phrase.'),
      reason: z.string().describe('The reason why the phrase could be misunderstood.'),
    })
  ).describe('A list of suggestions to avoid misunderstandings.'),
});
export type AvoidMisunderstandingSuggestionsOutput = z.infer<typeof AvoidMisunderstandingSuggestionsOutputSchema>;

export async function avoidMisunderstandingSuggestions(input: AvoidMisunderstandingSuggestionsInput): Promise<AvoidMisunderstandingSuggestionsOutput> {
  return avoidMisunderstandingSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'avoidMisunderstandingSuggestionsPrompt',
  input: {schema: AvoidMisunderstandingSuggestionsInputSchema},
  output: {schema: AvoidMisunderstandingSuggestionsOutputSchema},
  prompt: `You are an AI assistant that helps users avoid misunderstandings in their communication.

  Analyze the following text and suggest phrases to avoid that could lead to misunderstandings, along with suggested alternatives and a reason for each suggestion. Return a JSON array of suggestions.

  Text: {{{text}}}

  Each item in the array should include:
  - phraseToAvoid: The phrase that could be misunderstood.
  - suggestedAlternative: A suggested alternative phrase.
  - reason: The reason why the phrase could be misunderstood.

  Example output:
  [
    {
      "phraseToAvoid": "ASAP",
      "suggestedAlternative": "As soon as possible",
      "reason": "Not everyone knows what ASAP means, so it could be misunderstood."
    },
    {
      "phraseToAvoid": "Let's table this",
      "suggestedAlternative": "Let's postpone this discussion",
      "reason": "Not everyone is familiar with the expression 'table this', it can cause confusion among non-native speakers."
    }
  ]
  `,
});

const avoidMisunderstandingSuggestionsFlow = ai.defineFlow(
  {
    name: 'avoidMisunderstandingSuggestionsFlow',
    inputSchema: AvoidMisunderstandingSuggestionsInputSchema,
    outputSchema: AvoidMisunderstandingSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
