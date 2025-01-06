import { useState } from "react";
import TaskBoard from "@/components/tasks/TaskBoard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Host, Side } from "@/types/guest";
import { Task } from "@/types/task";

const Tasks = () => {
  const [selectedHost, setSelectedHost] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<string>("all");

  const { data: hosts = [] } = useQuery({
    queryKey: ['hosts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(host => ({
        ...host,
        side: host.side as Side
      })) as Host[];
    }
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Task[];
    }
  });

  const handleEditTask = (task: Task) => {
    // Implementation for editing task
    console.log("Editing task:", task);
  };

  const handleDeleteTask = (taskId: string) => {
    // Implementation for deleting task
    console.log("Deleting task:", taskId);
  };

  return (
    <div>
      <TaskBoard
        tasks={tasks}
        selectedHost={selectedHost}
        setSelectedHost={setSelectedHost}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
};

export default Tasks;