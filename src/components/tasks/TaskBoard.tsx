import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import TaskColumn from "./TaskColumn";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  event_types: string[];
  due_date: string | null;
  assigned_to: string | null;
}

interface TaskBoardProps {
  tasks: Task[];
  selectedHost: string;
  selectedEvent: string;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskBoard = ({ tasks, selectedHost, selectedEvent, onEditTask, onDeleteTask }: TaskBoardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const filteredTasks = tasks.filter((task) => {
    const hostMatch = !selectedHost || task.assigned_to === selectedHost;
    const eventMatch = !selectedEvent || task.event_types.includes(selectedEvent);
    return hostMatch && eventMatch;
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from("tasks")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Success",
        description: "Task status updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update task status: " + error.message,
        variant: "destructive",
      });
    },
  });

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    updateTaskMutation.mutate({
      id: draggableId,
      status: destination.droppableId,
    });
  };

  const columns = [
    { id: "pending", title: "To Do" },
    { id: "in-progress", title: "In Progress" },
    { id: "completed", title: "Completed" },
  ];

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(({ id, title }) => (
          <Droppable key={id} droppableId={id}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <TaskColumn
                  title={title}
                  tasks={filteredTasks}
                  status={id}
                  onEditTask={onEditTask}
                  onDeleteTask={onDeleteTask}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default TaskBoard;