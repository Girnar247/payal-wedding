import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Task = {
  id: string;
  title: string;
  description: string | null;
  event_type: string;
  status: string;
  priority: string;
  due_date: string | null;
  assigned_to: string | null;
  created_by: string | null;
};

const Tasks = () => {
  const [filter, setFilter] = useState("all");

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Task[];
    },
  });

  const filterTasks = (status: string) => {
    if (!tasks) return [];
    return tasks.filter((task) => 
      filter === "all" ? true : task.status === filter
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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

  if (isLoading) {
    return <div>Loading...</div>;
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
          {["pending", "in-progress", "completed"].map((status) => (
            <Card key={status} className="bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="capitalize">
                  {status.replace("-", " ")}
                </CardTitle>
                <CardDescription>
                  {filterTasks(status).length} tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {filterTasks(status).map((task) => (
                  <Card key={task.id} className="p-4">
                    <h3 className="font-medium mb-2">{task.title}</h3>
                    {task.description && (
                      <p className="text-sm text-gray-600 mb-3">
                        {task.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="secondary"
                        className={getStatusColor(task.status)}
                      >
                        {task.status}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={getPriorityColor(task.priority)}
                      >
                        {task.priority}
                      </Badge>
                      <Badge variant="outline">{task.event_type}</Badge>
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;