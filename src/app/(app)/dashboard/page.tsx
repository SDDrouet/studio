import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { projects } from '@/lib/data';
import { ProjectCard } from '@/components/project-card';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight font-headline">Proyectos</h2>
          <p className="text-muted-foreground">Aquí están los proyectos en los que tu equipo está trabajando.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Proyecto
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
