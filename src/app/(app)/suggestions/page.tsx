'use client';

import { useState } from 'react';
import {
  avoidMisunderstandingSuggestions,
  type AvoidMisunderstandingSuggestionsOutput,
} from '@/ai/flows/avoid-misunderstanding-suggestions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ThumbsDown, ThumbsUp, Lightbulb, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SuggestionsPage() {
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState<AvoidMisunderstandingSuggestionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      toast({
        title: 'Entrada requerida',
        description: 'Por favor, introduce algo de texto para analizar.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setSuggestions(null);

    try {
      const result = await avoidMisunderstandingSuggestions({ text });
      setSuggestions(result);
    } catch (error) {
      console.error('Error de sugerencia de IA:', error);
      toast({
        title: 'Ocurrió un error',
        description: 'No se pudieron obtener sugerencias de la IA. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Asistente de Comunicación IA</h1>
        <p className="text-muted-foreground mt-2">Escribe mensajes más claros y evita malentendidos.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analiza tu Texto</CardTitle>
          <CardDescription>
            Introduce un mensaje, correo electrónico o cualquier texto a continuación. Nuestra IA sugerirá mejoras para mayor claridad.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Textarea
              placeholder="Ej.: Dejemos esto en la mesa ASAP."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              disabled={isLoading}
            />
          </CardContent>
          <CardContent>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analizando...
                </>
              ) : (
                'Obtener Sugerencias'
              )}
            </Button>
          </CardContent>
        </form>
      </Card>

      {suggestions && (
        <div className="space-y-4">
          {suggestions.suggestions.length === 0 ? (
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>¡Se ve bien!</AlertTitle>
              <AlertDescription>
                Nuestra IA no encontró frases comunes que pudieran causar malentendidos en tu texto.
              </AlertDescription>
            </Alert>
          ) : (
            <>
            <h2 className="text-2xl font-bold font-headline">Sugerencias</h2>
            {suggestions.suggestions.map((suggestion, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardDescription>Sugerencia #{index + 1}</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <ThumbsDown className="h-5 w-5 text-destructive" />
                        <h3 className="font-semibold">Frase a Evitar</h3>
                    </div>
                    <p className="text-muted-foreground p-3 bg-muted rounded-md italic">
                      &quot;{suggestion.phraseToAvoid}&quot;
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <ThumbsUp className="h-5 w-5 text-green-500" />
                        <h3 className="font-semibold">Alternativa Sugerida</h3>
                    </div>
                    <p className="text-foreground p-3 bg-green-500/10 rounded-md italic">
                      &quot;{suggestion.suggestedAlternative}&quot;
                    </p>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <div className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Razón</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
