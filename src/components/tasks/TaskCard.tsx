import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { TaskHeader } from "./card/TaskHeader";
import { TaskDetails } from "./card/TaskDetails";
import { Task } from "@/types/task";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
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

  return (
    <Card className="mb-4 bg-white/50 backdrop-blur-sm">
      <CardHeader className="p-4 pb-2">
        <TaskHeader
          title={task.title}
          priority={task.priority}
          onEdit={() => onEdit(task)}
          onDelete={() => onDelete(task.id)}
        />
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <TaskDetails
          description={task.description}
          events={task.event_types || []}
          dueDate={task.due_date}
          assignedHostName={assignedHost?.name}
        />
      </CardContent>
    </Card>
  );
};

export default TaskCard;