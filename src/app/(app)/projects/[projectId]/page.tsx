
'use client';

import { notFound, useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { Project, Task, User, Feedback } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TeamMembers } from '@/components/team-members';
import { Calendar, CheckCircle, Eye, PlusCircle, Rocket, Star } from 'lucide-react';
import { TaskCard } from '@/components/task-card';
import { db } from '@/lib/firebase';
import { collection, doc, onSnapshot, query, where, updateDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { CreateTaskDialog } from '@/components/create-task-dialog';
import { CompleteProjectDialog } from '@/components/complete-project-dialog';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EditTaskDialog } from '@/components/edit-task-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { user: currentUser } = useAuth();
  
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateTaskDialogOpen, setCreateTaskDialogOpen] = useState(false);
  const [isEditTaskDialogOpen, setEditTaskDialogOpen] = useState(false);
  const [isCompleteProjectDialogOpen, setCompleteProjectDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);


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
          const projectMembers = membersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User));
          setMembers(projectMembers);
        }

      } else {
        notFound();
      }
    });

    const tasksRef = collection(db, 'tasks');
    const tasksQuery = query(tasksRef, where('projectId', '==', projectId));

    const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
        const projectTasks = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as Task));
        setTasks(projectTasks.sort((a,b) => a.completed === b.completed ? 0 : a.completed ? 1 : -1));
    });

    const feedbackRef = collection(db, 'feedback');
    const feedbackQuery = query(feedbackRef, where('projectId', '==', projectId));
    const unsubscribeFeedback = onSnapshot(feedbackQuery, (snapshot) => {
        const projectFeedback = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as Feedback));
        setFeedback(projectFeedback);
        setLoading(false);
    });


    return () => {
      unsubscribeProject();
      unsubscribeTasks();
      unsubscribeFeedback();
    }
  }, [projectId]);

  const handleTaskCompletionChange = async (taskId: string, completed: boolean) => {
    if (project?.status === 'completed') return;
    const taskRef = doc(db, 'tasks', taskId);
    try {
        await updateDoc(taskRef, { completed });
    } catch(error) {
        console.error("Error updating task: ", error);
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setEditTaskDialogOpen(true);
  };
  
  const handleDeleteTask = async (taskId: string) => {
    const taskRef = doc(db, 'tasks', taskId);
    try {
        await deleteDoc(taskRef);
    } catch (error) {
        console.error("Error deleting task: ", error);
    }
  }

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

  const userHasGivenFeedback = useMemo(() => {
      return feedback.some(f => f.userId === currentUser?.uid);
  }, [feedback, currentUser]);
  
  const getMemberByUid = (uid: string) => {
      return members.find(m => m.uid === uid);
  }

  if (loading) {
    return <div>Cargando...</div>;
  }
  
  if (!project) {
    return notFound();
  }

  const isProjectCompleted = project.status === 'completed';

  const completeButtonText = () => {
    if (isProjectCompleted) {
        return userHasGivenFeedback ? 'Feedback Enviado' : 'Enviar Retroalimentación';
    }
    return 'Completar Proyecto';
  };

  return (
    <>
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
              <Button variant="outline" onClick={() => setCreateTaskDialogOpen(true)} disabled={isProjectCompleted}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Añadir Tarea
              </Button>
              <Button onClick={() => setCompleteProjectDialogOpen(true)} disabled={(!allTasksCompleted && !isProjectCompleted) || (isProjectCompleted && userHasGivenFeedback)}>
                  <Rocket className="mr-2 h-4 w-4" />
                  {completeButtonText()}
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
          <Card className={isProjectCompleted ? 'border-primary' : ''}>
            <CardHeader>
              <CardTitle className="text-lg font-headline">Estado del Proyecto</CardTitle>
            </CardHeader>
            <CardContent>
              {isProjectCompleted ? (
                  <div className="flex items-center gap-2">
                      <Badge className="bg-primary text-primary-foreground hover:bg-primary">Completado</Badge>
                      <p className="text-sm text-muted-foreground">¡Gran trabajo!</p>
                  </div>
              ) : allTasksCompleted ? (
                  <div className="flex items-center gap-2">
                      <Badge className="bg-accent text-accent-foreground hover:bg-accent">Listo para Revisión</Badge>
                  </div>
              ) : (
                  <Badge variant="secondary">En Progreso</Badge>
              )}
            </CardContent>
          </Card>
        </div>
        
        {isProjectCompleted && feedback.length > 0 && (
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold tracking-tight font-headline">Retroalimentación del Equipo</h2>
                    <Button variant="outline" onClick={() => setShowFeedback(!showFeedback)}>
                        <Eye className="mr-2 h-4 w-4" />
                        {showFeedback ? 'Ocultar' : 'Mostrar'} Retroalimentación
                    </Button>
                </div>
                {showFeedback && (
                    <div className="space-y-4">
                        {feedback.map((fb) => {
                            const member = getMemberByUid(fb.userId);
                            return (
                                <Card key={fb.id}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <Avatar>
                                                <AvatarImage src={member?.avatar} />
                                                <AvatarFallback>{member?.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center">
                                                    <p className="font-semibold">{member?.name}</p>
                                                    <div className="flex items-center gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`h-5 w-5 ${i < fb.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-muted-foreground mt-2 italic">&quot;{fb.comment}&quot;</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>
        )}

        {/* Task List */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">Tareas</h2>
          <div className="space-y-4">
              {tasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onTaskCompletionChange={handleTaskCompletionChange} 
                    isProjectCompleted={isProjectCompleted}
                    onEdit={() => handleEditTask(task)}
                    onDelete={() => handleDeleteTask(task.id)}
                  />
              ))}
              {tasks.length === 0 && <p className="text-muted-foreground">Aún no se han añadido tareas a este proyecto.</p>}
          </div>
        </div>
      </div>

      {!isProjectCompleted && (
          <CreateTaskDialog 
            isOpen={isCreateTaskDialogOpen}
            setIsOpen={setCreateTaskDialogOpen}
            project={project}
            members={members}
          />
      )}

      {selectedTask && !isProjectCompleted &&(
        <EditTaskDialog
            isOpen={isEditTaskDialogOpen}
            setIsOpen={setEditTaskDialogOpen}
            task={selectedTask}
            project={project}
            members={members}
        />
      )}

      {currentUser && (
        <CompleteProjectDialog
            isOpen={isCompleteProjectDialogOpen}
            setIsOpen={setCompleteProjectDialogOpen}
            project={project}
            currentUser={currentUser}
        />
      )}
    </>
  );
}
