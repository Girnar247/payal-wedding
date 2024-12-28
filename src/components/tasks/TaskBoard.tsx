import { Task } from "@/types/task";
import TaskColumn from "./TaskColumn";
import { DragDropContext } from "@hello-pangea/dnd";

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

  const handleDragEnd = () => {
    // We'll implement drag and drop functionality later
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TaskColumn
          title="To Do"
          tasks={filteredTasks.filter((task) => task.status === "pending")}
          status="pending"
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
        <TaskColumn
          title="In Progress"
          tasks={filteredTasks.filter((task) => task.status === "in-progress")}
          status="in-progress"
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
        <TaskColumn
          title="Completed"
          tasks={filteredTasks.filter((task) => task.status === "completed")}
          status="completed"
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
      </div>
    </DragDropContext>
  );
};

export default TaskBoard;