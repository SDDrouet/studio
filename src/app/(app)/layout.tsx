'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Header } from '@/components/header';
import { Icons } from '@/components/icons';
import { MainNav } from '@/components/main-nav';
import { SidebarProvider, Sidebar, SidebarInset, SidebarFooter, SidebarHeader, SidebarContent } from '@/components/ui/sidebar';
import { UserNav } from '@/components/user-nav';
import Link from 'next/link';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div>Cargando...</div>; // O un componente de carga más elaborado
  }
  
  return (
    <SidebarProvider>
      <Sidebar className="border-r">
          <SidebarHeader className="p-4 flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Icons.logo className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold font-headline text-sidebar-foreground group-data-[collapsible=icon]:hidden">TareaColab</h1>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <MainNav />
          </SidebarContent>
          <SidebarFooter className="p-2 hidden group-data-[collapsible=icon]:block">
             <UserNav />
          </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-background">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
