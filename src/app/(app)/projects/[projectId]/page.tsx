'use client';

import { notFound, useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { Project, Task } from '@/lib/data';
import { findProjectById } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TeamMembers } from '@/components/team-members';
import { Calendar, CheckCircle, PlusCircle, Rocket } from 'lucide-react';
import { TaskCard } from '@/components/task-card';

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  
  const [project, setProject] = useState<Project | undefined>(undefined);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const foundProject = findProjectById(projectId);
    setProject(foundProject);
    setTasks(foundProject ? foundProject.tasks : []);
  }, [projectId]);

  const handleTaskCompletionChange = (taskId: string, completed: boolean) => {
    setTasks(currentTasks => 
        currentTasks.map(task => 
            task.id === taskId ? { ...task, completed } : task
        )
    );
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

  if (!project) {
    // In a real app, you'd show a loading skeleton
    return <div>Loading...</div>;
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
            <span>Due on {project.dueDate}</span>
          </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Task
            </Button>
            <Button disabled={!allTasksCompleted}>
                <Rocket className="mr-2 h-4 w-4" />
                Complete Project
            </Button>
        </div>
      </div>

      {/* Project Details Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-headline">Project Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-muted-foreground">Completion</span>
                        <span className="text-sm font-bold">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>
                <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>{completedTasks} of {totalTasks} tasks completed</span>
                </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-headline">Team Members</CardTitle>
            <CardDescription>People collaborating on this project.</CardDescription>
          </CardHeader>
          <CardContent>
            <TeamMembers users={project.members} />
          </CardContent>
        </Card>
        <Card className={allTasksCompleted ? 'border-accent' : ''}>
          <CardHeader>
            <CardTitle className="text-lg font-headline">Project Status</CardTitle>
          </CardHeader>
          <CardContent>
            {allTasksCompleted ? (
                <div className="flex items-center gap-2">
                    <Badge className="bg-accent text-accent-foreground hover:bg-accent">Completed</Badge>
                    <p className="text-sm text-muted-foreground">Ready for review!</p>
                </div>
            ) : (
                <Badge variant="secondary">In Progress</Badge>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Task List */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">Tasks</h2>
        <div className="space-y-4">
            {tasks.map(task => (
                <TaskCard key={task.id} task={task} onTaskCompletionChange={handleTaskCompletionChange} />
            ))}
            {tasks.length === 0 && <p className="text-muted-foreground">No tasks have been added to this project yet.</p>}
        </div>
      </div>
    </div>
  );
}
