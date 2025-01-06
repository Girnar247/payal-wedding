import { useState } from "react";
import TaskBoard from "@/components/tasks/TaskBoard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Host, Side } from "@/types/guest";

const Tasks = () => {
  const [selectedHost, setSelectedHost] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const { data: hosts = [] } = useQuery({
    queryKey: ['hosts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Ensure the side property is correctly typed
      return data.map(host => ({
        ...host,
        side: host.side as Side // Type assertion to ensure side is "bride" | "groom"
      })) as Host[];
    }
  });

  return (
    <div>
      <TaskBoard
        selectedHost={selectedHost}
        setSelectedHost={setSelectedHost}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        hosts={hosts}
      />
    </div>
  );
};

export default Tasks;