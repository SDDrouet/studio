import type { Task } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Badge } from "./ui/badge";

interface TaskCardProps {
    task: Task;
    onTaskCompletionChange: (taskId: string, completed: boolean) => void;
}

export function TaskCard({ task, onTaskCompletionChange }: TaskCardProps) {
    return (
        <Card className={`transition-all ${task.completed ? 'bg-muted/50' : ''}`}>
            <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
                <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={(checked) => onTaskCompletionChange(task.id, !!checked)}
                    className="mt-1"
                />
                <div className="flex-1 grid gap-1.5">
                    <CardTitle className={`text-lg ${task.completed ? 'line-through text-muted-foreground' : ''}`}>{task.title}</CardTitle>
                    <CardDescription className={`${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.description}
                    </CardDescription>
                </div>
                {task.assignee && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                                    <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Asignado a {task.assignee.name}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <Badge variant={task.completed ? "secondary" : "outline"} className="text-xs">
                    Vence: {task.dueDate}
                </Badge>
            </CardContent>
        </Card>
    )
}
