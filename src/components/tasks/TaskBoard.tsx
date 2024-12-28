import { Task } from "@/types/task";
import { TaskColumn } from "./TaskColumn";

interface TaskBoardProps {
  tasks: Task[];
  selectedHost: string;
  selectedEvent: string;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskBoard = ({
  tasks,
  selectedHost,
  selectedEvent,
  onEditTask,
  onDeleteTask,
}: TaskBoardProps) => {
  const filterTasks = (tasks: Task[]) => {
    return tasks.filter((task) => {
      const hostMatch = selectedHost === "all" || task.assigned_to === selectedHost;
      const eventMatch =
        selectedEvent === "all" ||
        task.event_types?.includes(selectedEvent) ||
        task.event_type === selectedEvent;
      return hostMatch && eventMatch;
    });
  };

  const filteredTasks = filterTasks(tasks);

  const pendingTasks = filteredTasks.filter((task) => task.status === "pending");
  const inProgressTasks = filteredTasks.filter(
    (task) => task.status === "in-progress"
  );
  const completedTasks = filteredTasks.filter(
    (task) => task.status === "completed"
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <TaskColumn
        title="To Do"
        tasks={pendingTasks}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
      />
      <TaskColumn
        title="In Progress"
        tasks={inProgressTasks}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
      />
      <TaskColumn
        title="Completed"
        tasks={completedTasks}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
      />
    </div>
  );
};

export default TaskBoard;