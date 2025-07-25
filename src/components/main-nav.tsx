'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { LayoutDashboard, MessageSquareQuote, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MainNav() {
  const pathname = usePathname();

  const menuItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/suggestions',
      label: 'AI Suggestions',
      icon: MessageSquareQuote,
    },
    {
      href: '/profile',
      label: 'Profile',
      icon: UserCircle,
    },
  ];

  return (
    <div className="p-2 flex-1">
      <SidebarMenu>
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href}
              className={cn(
                'w-full justify-start',
                pathname === item.href && 'bg-sidebar-accent'
              )}
            >
              <Link href={item.href}>
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </div>
  );
}
