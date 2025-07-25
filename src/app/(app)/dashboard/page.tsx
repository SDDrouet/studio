'use client';

import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ProjectCard } from '@/components/project-card';
import type { Project, User } from '@/lib/data';
import { CreateProjectDialog } from '@/components/create-project-dialog';

export default function DashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateProjectDialogOpen, setCreateProjectDialogOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    // Fetch all users for the create/edit project dialog
    const usersUnsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
        const usersList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User));
        setAllUsers(usersList);
    });

    const projectsRef = collection(db, 'projects');
    const q = query(projectsRef, where('memberIds', 'array-contains', user.uid));

    const projectsUnsubscribe = onSnapshot(q, (querySnapshot) => {
      const userProjects: Project[] = [];
      querySnapshot.forEach((doc) => {
        userProjects.push({ id: doc.id, ...doc.data() } as Project);
      });
      setProjects(userProjects);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching projects: ", error);
      setLoading(false);
    });

    return () => {
        usersUnsubscribe();
        projectsUnsubscribe();
    }
  }, [user]);

  if (loading) {
    return <div>Cargando proyectos...</div>;
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight font-headline">Proyectos</h2>
            <p className="text-muted-foreground">Aquí están los proyectos en los que tu equipo está trabajando.</p>
          </div>
          <Button onClick={() => setCreateProjectDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Proyecto
          </Button>
        </div>

        {projects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} allUsers={allUsers} currentUser={user} />
            ))}
          </div>
        ) : (
          <p>No se encontraron proyectos. ¡Crea uno para empezar!</p>
        )}
      </div>
      <CreateProjectDialog
        isOpen={isCreateProjectDialogOpen}
        setIsOpen={setCreateProjectDialogOpen}
        users={allUsers}
        currentUser={user}
      />
    </>
  );
}
