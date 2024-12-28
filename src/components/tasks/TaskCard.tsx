import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, UserIcon } from "lucide-react";
import { format } from "date-fns";

interface TaskCardProps {
  task: {
    title: string;
    description: string | null;
    status: string;
    priority: string;
    event_type: string;
    due_date: string | null;
    assigned_to: string | null;
  };
}

const TaskCard = ({ task }: TaskCardProps) => {
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
          <Badge variant="secondary" className={getPriorityColor(task.priority)}>
            {task.priority}
          </Badge>
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
          {task.assigned_to && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <UserIcon className="h-3 w-3" />
              Assigned
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;