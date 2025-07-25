'use client';

import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { useState } from 'react';
import { EditProfileDialog } from '@/components/edit-profile-dialog';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  if (!user) {
    return <div>Cargando perfil...</div>;
  }

  return (
    <>
      <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight font-headline">Tu Perfil</h1>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Perfil
              </Button>
          </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'Usuario'} />
                <AvatarFallback className="text-3xl">{user.displayName ? user.displayName.charAt(0) : user.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                  <h2 className="text-2xl font-semibold font-headline">{user.displayName || 'Nombre no establecido'}</h2>
                  <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Detalles Adicionales</CardTitle>
            <CardDescription>Esta información se puede ampliar en el futuro.</CardDescription>
          </CardHeader>
          <CardContent>
              <p className="text-sm text-muted-foreground">Actualmente no hay detalles adicionales para mostrar.</p>
          </CardContent>
        </Card>

      </div>
      {user && (
        <EditProfileDialog 
            isOpen={isEditDialogOpen}
            setIsOpen={setIsEditDialogOpen}
            currentUser={user}
        />
      )}
    </>
  );
}
