import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import TaskColumn from "@/components/tasks/TaskColumn";

const Tasks = () => {
  const { data: tasks = [], isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-wedding-cream p-6 flex items-center justify-center">
        <p>Loading tasks...</p>
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
          <Link to="/">
            <Button variant="outline" className="bg-white/50">
              <Home className="h-4 w-4 mr-2" />
              Back to Guest List
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TaskColumn title="To Do" tasks={tasks} status="pending" />
          <TaskColumn title="In Progress" tasks={tasks} status="in-progress" />
          <TaskColumn title="Completed" tasks={tasks} status="completed" />
        </div>
      </div>
    </div>
  );
};

export default Tasks;