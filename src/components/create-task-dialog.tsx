
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import type { User, Project } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

const taskSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres.'),
  description: z.string().optional(),
  dueDate: z.date({ required_error: 'La fecha de vencimiento es obligatoria.' }),
  assigneeId: z.string().nullable(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface CreateTaskDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  project: Project;
  members: User[];
}

export function CreateTaskDialog({ isOpen, setIsOpen, project, members }: CreateTaskDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Parse the project due date
  const projectDueDate = parse(project.dueDate, 'PPP', new Date(), { locale: es });

  const formatedTaskSchema = taskSchema.refine(data => data.dueDate <= projectDueDate, {
    message: 'La fecha de vencimiento de la tarea no puede ser posterior a la del proyecto.',
    path: ['dueDate'],
  });

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(formatedTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      assigneeId: null,
    },
  });

  const onSubmit = async (data: TaskFormValues) => {
    setIsLoading(true);
    try {
      await addDoc(collection(db, 'tasks'), {
        projectId: project.id,
        title: data.title,
        description: data.description || '',
        dueDate: format(data.dueDate, 'PPP', { locale: es }),
        completed: false,
        assigneeId: data.assigneeId,
        createdAt: serverTimestamp(),
      });
      toast({ title: '¡Éxito!', description: 'La tarea se ha creado correctamente.' });
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error('Error creando la tarea:', error);
      toast({ title: 'Error', description: 'No se pudo crear la tarea. Inténtalo de nuevo.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Crear Nueva Tarea</DialogTitle>
          <DialogDescription>
            Añade una nueva tarea al proyecto &quot;{project.name}&quot;.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título de la Tarea</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Diseñar el borrador inicial" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe los requisitos de la tarea" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Fecha de Vencimiento</FormLabel>
                        <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                            <Button
                                variant={'outline'}
                                className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                                )}
                            >
                                {field.value ? (
                                format(field.value, 'PPP', { locale: es })
                                ) : (
                                <span>Elige una fecha</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date() || date > projectDueDate}
                            initialFocus
                            locale={es}
                            />
                        </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="assigneeId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Asignar a</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar un miembro" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="null">Sin asignar</SelectItem>
                                    {members.map(member => (
                                        <SelectItem key={member.uid} value={member.uid}>
                                            {member.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Crear Tarea
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
