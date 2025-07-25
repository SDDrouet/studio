import type { User } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TeamMembersProps {
  users: User[];
  maxToShow?: number;
}

export function TeamMembers({ users, maxToShow = 4 }: TeamMembersProps) {
  const visibleUsers = users.slice(0, maxToShow);
  const hiddenUsersCount = users.length - maxToShow;

  return (
    <TooltipProvider>
      <div className="flex items-center -space-x-2">
        {visibleUsers.map((user) => (
          <Tooltip key={user.id}>
            <TooltipTrigger asChild>
              <Avatar className="border-2 border-background">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{user.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        {hiddenUsersCount > 0 && (
          <Avatar className="border-2 border-background">
            <AvatarFallback>+{hiddenUsersCount}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </TooltipProvider>
  );
}
