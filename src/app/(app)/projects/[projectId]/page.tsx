'use client';

import { notFound, useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { Project, Task, User } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TeamMembers } from '@/components/team-members';
import { Calendar, CheckCircle, PlusCircle, Rocket } from 'lucide-react';
import { TaskCard } from '@/components/task-card';
import { db } from '@/lib/firebase';
import { collection, doc, onSnapshot, query, where, updateDoc, getDoc, getDocs } from 'firebase/firestore';

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    setLoading(true);
    const projectRef = doc(db, 'projects', projectId);
    
    const unsubscribeProject = onSnapshot(projectRef, async (docSnap) => {
      if (docSnap.exists()) {
        const projectData = { id: docSnap.id, ...docSnap.data() } as Project;
        setProject(projectData);

        // Fetch members
        if (projectData.memberIds && projectData.memberIds.length > 0) {
          const usersRef = collection(db, 'users');
          const membersQuery = query(usersRef, where('uid', 'in', projectData.memberIds));
          const membersSnapshot = await getDocs(membersQuery);
          const projectMembers = membersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
          setMembers(projectMembers);
        }

      } else {
        notFound();
      }
    });

    const tasksRef = collection(db, 'tasks');
    const q = query(tasksRef, where('projectId', '==', projectId));

    const unsubscribeTasks = onSnapshot(q, (snapshot) => {
        const projectTasks = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as Task));
        setTasks(projectTasks);
        setLoading(false);
    });

    return () => {
      unsubscribeProject();
      unsubscribeTasks();
    }
  }, [projectId]);

  const handleTaskCompletionChange = async (taskId: string, completed: boolean) => {
    const taskRef = doc(db, 'tasks', taskId);
    try {
        await updateDoc(taskRef, { completed });
    } catch(error) {
        console.error("Error updating task: ", error);
    }
  };

  const { completedTasks, totalTasks, progress, allTasksCompleted } = useMemo(() => {
    if (!tasks) return { completedTasks: 0, totalTasks: 0, progress: 0, allTasksCompleted: false };
    const completed = tasks.filter(t => t.completed).length;
    const total = tasks.length;
    const progressPercentage = total > 0 ? (completed / total) * 100 : 0;
    return {
      completedTasks: completed,
      totalTasks: total,
      progress: progressPercentage,
      allTasksCompleted: total > 0 && completed === total,
    };
  }, [tasks]);

  if (loading) {
    return <div>Cargando...</div>;
  }
  
  if (!project) {
    return notFound();
  }

  return (
    <div className="space-y-8">
      {/* Project Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">{project.name}</h1>
          <p className="text-muted-foreground mt-1">{project.description}</p>
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Vence el {project.dueDate}</span>
          </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Tarea
            </Button>
            <Button disabled={!allTasksCompleted}>
                <Rocket className="mr-2 h-4 w-4" />
                Completar Proyecto
            </Button>
        </div>
      </div>

      {/* Project Details Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-headline">Progreso del Proyecto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-muted-foreground">Completado</span>
                        <span className="text-sm font-bold">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>
                <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>{completedTasks} de {totalTasks} tareas completadas</span>
                </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-headline">Miembros del Equipo</CardTitle>
            <CardDescription>Personas colaborando en este proyecto.</CardDescription>
          </CardHeader>
          <CardContent>
            <TeamMembers users={members} />
          </CardContent>
        </Card>
        <Card className={allTasksCompleted ? 'border-accent' : ''}>
          <CardHeader>
            <CardTitle className="text-lg font-headline">Estado del Proyecto</CardTitle>
          </CardHeader>
          <CardContent>
            {allTasksCompleted ? (
                <div className="flex items-center gap-2">
                    <Badge className="bg-accent text-accent-foreground hover:bg-accent">Completado</Badge>
                    <p className="text-sm text-muted-foreground">¡Listo para revisión!</p>
                </div>
            ) : (
                <Badge variant="secondary">En Progreso</Badge>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Task List */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">Tareas</h2>
        <div className="space-y-4">
            {tasks.map(task => (
                <TaskCard key={task.id} task={task} onTaskCompletionChange={handleTaskCompletionChange} />
            ))}
            {tasks.length === 0 && <p className="text-muted-foreground">Aún no se han añadido tareas a este proyecto.</p>}
        </div>
      </div>
    </div>
  );
}
