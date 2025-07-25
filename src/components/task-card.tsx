
import type { Task, User } from "@/lib/data";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

interface TaskCardProps {
    task: Task;
    onTaskCompletionChange: (taskId: string, completed: boolean) => void;
    isProjectCompleted: boolean;
}

export function TaskCard({ task, onTaskCompletionChange, isProjectCompleted }: TaskCardProps) {
    const [assignee, setAssignee] = useState<User | null>(null);

    useEffect(() => {
        const fetchAssignee = async () => {
            if (task.assigneeId) {
                const q = query(collection(db, "users"), where("uid", "==", task.assigneeId));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    setAssignee({ id: userDoc.id, ...userDoc.data() } as User);
                }
            } else {
                setAssignee(null);
            }
        };
        fetchAssignee();
    }, [task.assigneeId]);


    return (
        <Card className={`transition-all ${task.completed ? 'bg-muted/50' : ''}`}>
            <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
                <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={(checked) => onTaskCompletionChange(task.id, !!checked)}
                    className="mt-1"
                    disabled={isProjectCompleted}
                />
                <div className="flex-1 grid gap-1.5">
                    <div className={`font-semibold ${task.completed ? 'line-through text-muted-foreground' : ''}`}>{task.title}</div>
                    <p className={`text-sm text-muted-foreground ${task.completed ? 'line-through' : ''}`}>
                        {task.description}
                    </p>
                </div>
                {assignee ? (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={assignee.avatar} alt={assignee.name} />
                                    <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Asignado a {assignee.name}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ) : (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                 <Avatar className="h-8 w-8">
                                    <AvatarFallback>?</AvatarFallback>
                                </Avatar>
                            </TooltipTrigger>
                             <TooltipContent>
                                <p>Sin asignar</p>
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
