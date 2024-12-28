import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { Task } from "@/types/task";

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  status: string;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskColumn = ({ title, tasks, status, onEditTask, onDeleteTask }: TaskColumnProps) => {
  const filteredTasks = tasks.filter((task) => task.status === status);

  return (
    <Card className="bg-wedding-cream/50 backdrop-blur-sm">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg font-medium text-wedding-text">
          {title} ({filteredTasks.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        {filteredTasks.map((task, index) => (
          <Draggable key={task.id} draggableId={task.id} index={index}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <TaskCard
                  task={task}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                />
              </div>
            )}
          </Draggable>
        ))}
      </CardContent>
    </Card>
  );
};

export default TaskColumn;