import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { EventType } from "@/types/guest";

interface Task {
  id: string;
  title: string;
  description: string | null;
  event_type: EventType;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  assigned_to: string | null;
  created_by: string | null;
}

const Tasks = () => {
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState<EventType | 'all'>('all');

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: 'Error fetching tasks',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      return data as Task[];
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-wedding-cream p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl md:text-5xl font-playfair text-wedding-text">
            Wedding Tasks
          </h1>
          <Button variant="outline" className="bg-white/50">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">To Do</h2>
            {tasks
              .filter((task) => task.status === 'pending')
              .map((task) => (
                <div key={task.id} className="p-4 bg-white rounded-lg mb-4 shadow">
                  <h3 className="font-medium">{task.title}</h3>
                  <p className="text-sm text-gray-500">{task.description}</p>
                </div>
              ))}
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">In Progress</h2>
            {tasks
              .filter((task) => task.status === 'in-progress')
              .map((task) => (
                <div key={task.id} className="p-4 bg-white rounded-lg mb-4 shadow">
                  <h3 className="font-medium">{task.title}</h3>
                  <p className="text-sm text-gray-500">{task.description}</p>
                </div>
              ))}
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Completed</h2>
            {tasks
              .filter((task) => task.status === 'completed')
              .map((task) => (
                <div key={task.id} className="p-4 bg-white rounded-lg mb-4 shadow">
                  <h3 className="font-medium">{task.title}</h3>
                  <p className="text-sm text-gray-500">{task.description}</p>
                </div>
              ))}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Tasks;