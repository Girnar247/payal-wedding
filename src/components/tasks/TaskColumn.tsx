import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TaskCard from "./TaskCard";

interface TaskColumnProps {
  title: string;
  tasks: any[];
  status: string;
}

const TaskColumn = ({ title, tasks, status }: TaskColumnProps) => {
  const filteredTasks = tasks.filter((task) => task.status === status);

  return (
    <Card className="bg-wedding-cream/50 backdrop-blur-sm">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg font-medium text-wedding-text">
          {title} ({filteredTasks.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        {filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </CardContent>
    </Card>
  );
};

export default TaskColumn;