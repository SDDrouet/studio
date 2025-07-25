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
      'El texto a analizar en busca de frases que puedan causar malentendidos.'
    ),
});
export type AvoidMisunderstandingSuggestionsInput = z.infer<typeof AvoidMisunderstandingSuggestionsInputSchema>;

const AvoidMisunderstandingSuggestionsOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      phraseToAvoid: z.string().describe('La frase que podría ser malinterpretada.'),
      suggestedAlternative: z.string().describe('Una frase alternativa sugerida.'),
      reason: z.string().describe('La razón por la que la frase podría ser malinterpretada.'),
    })
  ).describe('Una lista de sugerencias para evitar malentendidos.'),
});
export type AvoidMisunderstandingSuggestionsOutput = z.infer<typeof AvoidMisunderstandingSuggestionsOutputSchema>;

export async function avoidMisunderstandingSuggestions(input: AvoidMisunderstandingSuggestionsInput): Promise<AvoidMisunderstandingSuggestionsOutput> {
  return avoidMisunderstandingSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'avoidMisunderstandingSuggestionsPrompt',
  input: {schema: AvoidMisunderstandingSuggestionsInputSchema},
  output: {schema: AvoidMisunderstandingSuggestionsOutputSchema},
  prompt: `Eres un asistente de IA que ayuda a los usuarios a evitar malentendidos en su comunicación.

  Analiza el siguiente texto y sugiere frases a evitar que podrían llevar a malentendidos, junto con alternativas sugeridas y una razón para cada sugerencia. Devuelve un array JSON de sugerencias.

  Texto: {{{text}}}

  Cada elemento en el array debe incluir:
  - phraseToAvoid: La frase que podría ser malinterpretada.
  - suggestedAlternative: Una frase alternativa sugerida.
  - reason: La razón por la que la frase podría ser malinterpretada.

  Ejemplo de salida:
  [
    {
      "phraseToAvoid": "ASAP",
      "suggestedAlternative": "Tan pronto como sea posible",
      "reason": "No todo el mundo sabe lo que significa ASAP, por lo que podría ser malinterpretado."
    },
    {
      "phraseToAvoid": "Dejemos esto en la mesa",
      "suggestedAlternative": "Pospongamos esta discusión",
      "reason": "No todo el mundo está familiarizado con la expresión 'dejar en la mesa', puede causar confusión entre los hablantes no nativos."
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
