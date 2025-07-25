'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Star } from 'lucide-react';
import type { Project } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import type { User as FirebaseUser } from 'firebase/auth';

const feedbackSchema = z.object({
  rating: z.string().nonempty('La calificación es obligatoria.'),
  comment: z.string().min(10, 'El comentario debe tener al menos 10 caracteres.'),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

interface CompleteProjectDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  project: Project;
  currentUser: FirebaseUser;
  teamSize: number;
  currentFeedbackCount: number;
}

export function CompleteProjectDialog({ 
    isOpen, 
    setIsOpen, 
    project, 
    currentUser, 
    teamSize, 
    currentFeedbackCount 
}: CompleteProjectDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: '5',
      comment: '',
    },
  });

  const onSubmit = async (data: FeedbackFormValues) => {
    setIsLoading(true);
    try {
      // Add feedback to the 'feedback' collection
      await addDoc(collection(db, 'feedback'), {
        projectId: project.id,
        userId: currentUser.uid,
        rating: parseInt(data.rating, 10),
        comment: data.comment,
        createdAt: serverTimestamp(),
      });
      
      // Check if all members have given feedback
      if (currentFeedbackCount + 1 === teamSize) {
        const projectRef = doc(db, 'projects', project.id);
        await updateDoc(projectRef, {
          status: 'completed',
        });
        toast({ title: '¡Proyecto completado!', description: 'Todos los miembros han enviado su retroalimentación.' });
      } else {
        toast({ title: '¡Gracias por tu feedback!', description: 'Tu retroalimentación ha sido guardada.' });
      }

      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error('Error enviando la retroalimentación:', error);
      toast({ title: 'Error', description: 'No se pudo enviar tu retroalimentación. Inténtalo de nuevo.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Retroalimentación Final del Proyecto</DialogTitle>
          <DialogDescription>
            Comparte tus pensamientos sobre el proyecto &quot;{project.name}&quot;. Tu feedback es importante.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Calidad General del Trabajo</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex items-center space-x-2"
                      >
                        {[1, 2, 3, 4, 5].map((value) => (
                           <FormItem key={value} className="flex items-center space-x-1 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value={String(value)} id={`r${value}`} className="sr-only" />
                                </FormControl>
                                <FormLabel htmlFor={`r${value}`} className="cursor-pointer">
                                    <Star className={`h-8 w-8 transition-colors ${parseInt(field.value) >= value ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground hover:text-yellow-300'}`} />
                                </FormLabel>
                           </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comentarios</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="¿Qué salió bien? ¿Qué podría mejorar? ¿Cómo fue la colaboración?"
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enviar Retroalimentación
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
