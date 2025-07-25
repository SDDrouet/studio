import { Bell } from 'lucide-react';
import { Button } from './ui/button';
import { SidebarTrigger } from './ui/sidebar';
import { UserNav } from './user-nav';

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex-1">
        {/* Can be replaced with dynamic breadcrumbs */}
        <h1 className="text-lg font-semibold font-headline">Panel</h1>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Alternar notificaciones</span>
        </Button>
        <UserNav />
      </div>
    </header>
  );
}
