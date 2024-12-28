import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, UserIcon, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    event_type: string;
    due_date: string | null;
    assigned_to: string | null;
  };
  onEdit: (task: any) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const { data: assignedHost } = useQuery({
    queryKey: ["host", task.assigned_to],
    queryFn: async () => {
      if (!task.assigned_to) return null;
      const { data, error } = await supabase
        .from("hosts")
        .select("name")
        .eq("id", task.assigned_to)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!task.assigned_to,
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="mb-4 bg-white/50 backdrop-blur-sm">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-medium text-wedding-text">{task.title}</h3>
          <div className="flex gap-2">
            <Badge variant="secondary" className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(task)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-600 hover:text-red-700"
              onClick={() => onDelete(task.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-2">
        {task.description && (
          <p className="text-sm text-gray-600">{task.description}</p>
        )}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-wedding-sage/30">
            {task.event_type}
          </Badge>
          {task.due_date && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <CalendarIcon className="h-3 w-3" />
              {format(new Date(task.due_date), "MMM d, yyyy")}
            </div>
          )}
          {assignedHost && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <UserIcon className="h-3 w-3" />
              {assignedHost.name}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;