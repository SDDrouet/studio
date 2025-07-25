'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import type { User, Project } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

const projectSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  description: z.string().optional(),
  dueDate: z.date({ required_error: 'La fecha de vencimiento es obligatoria.' }),
  memberIds: z.array(z.string()).min(1, 'Debes seleccionar al menos un miembro.'),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface EditProjectDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  project: Project;
  users: User[];
}

export function EditProjectDialog({ isOpen, setIsOpen, project, users }: EditProjectDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project.name,
      description: project.description,
      dueDate: parse(project.dueDate, 'PPP', new Date(), { locale: es }),
      memberIds: project.memberIds,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: project.name,
        description: project.description,
        dueDate: parse(project.dueDate, 'PPP', new Date(), { locale: es }),
        memberIds: project.memberIds,
      });
    }
  }, [isOpen, project, form]);


  const onSubmit = async (data: ProjectFormValues) => {
    setIsLoading(true);
    try {
      const projectRef = doc(db, 'projects', project.id);
      await updateDoc(projectRef, {
        name: data.name,
        description: data.description || '',
        dueDate: format(data.dueDate, 'PPP', { locale: es }),
        memberIds: data.memberIds,
      });
      toast({ title: '¡Éxito!', description: 'El proyecto se ha actualizado correctamente.' });
      setIsOpen(false);
    } catch (error) {
      console.error('Error actualizando el proyecto:', error);
      toast({ title: 'Error', description: 'No se pudo actualizar el proyecto. Inténtalo de nuevo.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Editar Proyecto</DialogTitle>
          <DialogDescription>
            Actualiza los detalles del proyecto &quot;{project.name}&quot;.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Proyecto</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Rediseño de la página de inicio" {...field} />
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
                      <Textarea placeholder="Describe brevemente el objetivo del proyecto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                          disabled={(date) => date < new Date('1900-01-01')}
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
                name="memberIds"
                render={() => (
                  <FormItem>
                    <FormLabel>Miembros del Equipo</FormLabel>
                    <FormDescription>
                      Selecciona los usuarios que participarán en este proyecto.
                    </FormDescription>
                    <ScrollArea className="h-40 w-full rounded-md border p-4">
                        {users.map((user) => (
                           <FormField
                           key={user.uid}
                           control={form.control}
                           name="memberIds"
                           render={({ field }) => {
                             return (
                               <FormItem
                                 key={user.uid}
                                 className="flex flex-row items-center space-x-3 space-y-0 py-2"
                               >
                                 <FormControl>
                                   <Checkbox
                                     checked={field.value?.includes(user.uid)}
                                     onCheckedChange={(checked) => {
                                       return checked
                                         ? field.onChange([...field.value, user.uid])
                                         : field.onChange(
                                             field.value?.filter(
                                               (value) => value !== user.uid && value !== project.ownerId
                                             )
                                           )
                                     }}
                                     disabled={user.uid === project.ownerId}
                                   />
                                 </FormControl>
                                 <FormLabel className="font-normal w-full cursor-pointer">
                                   <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{user.name}{user.uid === project.ownerId && " (Owner)"}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                   </div>
                                 </FormLabel>
                               </FormItem>
                             )
                           }}
                         />
                        ))}
                    </ScrollArea>
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
                Guardar Cambios
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
