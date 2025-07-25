import Link from 'next/link';
import type { Project, Task, User } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TeamMembers } from './team-members';
import { Badge } from './ui/badge';
import { FolderKanban } from 'lucide-react';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!project.id) return;
  
    const tasksRef = collection(db, 'tasks');
    const q = query(tasksRef, where('projectId', '==', project.id));
  
    const unsubscribeTasks = onSnapshot(q, (snapshot) => {
      const projectTasks = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}) as Task);
      setTasks(projectTasks);
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
    };
  }, [project.id, project.memberIds]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

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
    <Link href={`/projects/${project.id}`}>
      <Card className="h-full flex flex-col hover:border-primary hover:shadow-md transition-all">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="font-headline text-xl mb-2">{project.name}</CardTitle>
            <FolderKanban className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progreso</span>
              <span className="text-sm text-muted-foreground">{completedTasks} / {totalTasks} tareas</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <TeamMembers users={members} />
          <Badge variant="outline">Vence: {project.dueDate}</Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
