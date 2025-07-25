import Link from 'next/link';
import type { Project, Task, User, Feedback } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TeamMembers } from './team-members';
import { Badge } from './ui/badge';
import { Edit, FolderKanban, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { EditProjectDialog } from './edit-project-dialog';
import { Button } from './ui/button';

interface ProjectCardProps {
  project: Project;
  allUsers: User[];
}

export function ProjectCard({ project, allUsers }: ProjectCardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (!project.id) return;
  
    const tasksRef = collection(db, 'tasks');
    const tasksQuery = query(tasksRef, where('projectId', '==', project.id));
    const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
      const projectTasks = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}) as Task);
      setTasks(projectTasks);
    });

    const feedbackRef = collection(db, 'feedback');
    const feedbackQuery = query(feedbackRef, where('projectId', '==', project.id));
    const unsubscribeFeedback = onSnapshot(feedbackQuery, (snapshot) => {
        const projectFeedback = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as Feedback));
        setFeedback(projectFeedback);
    });
  
    const fetchMembers = async () => {
      if (project.memberIds && project.memberIds.length > 0) {
        const usersRef = collection(db, 'users');
        const membersQuery = query(usersRef, where('uid', 'in', project.memberIds));
        const membersSnapshot = await getDocs(membersQuery);
        const projectMembers = membersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
        setMembers(projectMembers);
      }
      setLoading(false);
    };
  
    fetchMembers();
  
    return () => {
      unsubscribeTasks();
      unsubscribeFeedback();
    };
  }, [project.id, project.memberIds]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const isCompleted = project.status === 'completed';

  const averageRating = feedback.length > 0
    ? feedback.reduce((acc, fb) => acc + fb.rating, 0) / feedback.length
    : 0;

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditDialogOpen(true);
  }

  if (loading) {
      return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </CardHeader>
            <CardContent className='flex-grow'>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            </CardContent>
            <CardFooter>
                 <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </CardFooter>
        </Card>
      )
  }

  return (
    <>
    <Link href={`/projects/${project.id}`}>
      <Card className="h-full flex flex-col hover:border-primary hover:shadow-md transition-all">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="font-headline text-xl mb-2 pr-8">{project.name}</CardTitle>
            <div className="flex items-center gap-2">
                {isCompleted ? (
                     <Badge className="bg-primary text-primary-foreground hover:bg-primary">Completado</Badge>
                ) : (
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleEditClick} disabled={isCompleted}>
                        <Edit className="h-4 w-4" />
                    </Button>
                )}
            </div>
          </div>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progreso</span>
              <span className="text-sm text-muted-foreground">{completedTasks} / {totalTasks} tareas</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
           {isCompleted && averageRating > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Calificación:</span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                ))}
                <span className="text-xs text-muted-foreground ml-1">({averageRating.toFixed(1)})</span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <TeamMembers users={members} />
          <Badge variant="outline">Vence: {project.dueDate}</Badge>
        </CardFooter>
      </Card>
    </Link>
    {!isCompleted && (
        <EditProjectDialog
            isOpen={isEditDialogOpen}
            setIsOpen={setIsEditDialogOpen}
            project={project}
            users={allUsers}
        />
    )}
    </>
  );
}
