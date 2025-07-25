import Link from 'next/link';
import type { Project } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TeamMembers } from './team-members';
import { Badge } from './ui/badge';
import { FolderKanban } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter((task) => task.completed).length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

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
          <TeamMembers users={project.members} />
          <Badge variant="outline">Vence: {project.dueDate}</Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
