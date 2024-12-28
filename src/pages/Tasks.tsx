import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Home, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { TaskForm } from "@/components/tasks/TaskForm";
import TaskBoard from "@/components/tasks/TaskBoard";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { useTaskMutations } from "@/components/tasks/mutations/useTaskMutations";

const Tasks = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [selectedHost, setSelectedHost] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState("all");

  const { deleteTaskMutation, updateTaskMutation, addTaskMutation } = useTaskMutations();

  const { data: tasks = [], isLoading: isLoadingTasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: hosts = [], isLoading: isLoadingHosts } = useQuery({
    queryKey: ["hosts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hosts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleEdit = (task: any) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleDelete = (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTaskMutation.mutate(taskId);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  // Get unique event types from tasks
  const eventTypes = Array.from(
    new Set(
      tasks.flatMap((task) => [
        ...(task.event_types || []),
        task.event_type,
      ]).filter(Boolean)
    )
  );

  if (isLoadingTasks || isLoadingHosts) {
    return (
      <div className="min-h-screen bg-wedding-cream p-6 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wedding-cream p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-playfair text-wedding-text">
              Wedding Tasks
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and track all wedding-related tasks
            </p>
          </div>
          <div className="flex gap-4">
            <Link to="/">
              <Button variant="outline" className="bg-white/50">
                <Home className="h-4 w-4 mr-2" />
                Back to Guest List
              </Button>
            </Link>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        <TaskFilters
          hosts={hosts}
          selectedHost={selectedHost}
          onHostSelect={setSelectedHost}
          eventTypes={eventTypes}
          selectedEvent={selectedEvent}
          onEventSelect={setSelectedEvent}
        />

        <TaskBoard
          tasks={tasks}
          selectedHost={selectedHost}
          selectedEvent={selectedEvent}
          onEditTask={handleEdit}
          onDeleteTask={handleDelete}
        />
      </div>

      <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogTitle>
            {editingTask ? "Edit Task" : "Add New Task"}
          </DialogTitle>
          <TaskForm
            initialData={editingTask}
            onSubmit={(data) => {
              if (editingTask) {
                updateTaskMutation.mutate({ id: editingTask.id, ...data });
              } else {
                addTaskMutation.mutate(data);
              }
              handleCloseForm();
            }}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tasks;