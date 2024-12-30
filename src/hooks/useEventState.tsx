import { EventType, EventDetails } from "@/types/guest";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useEventState = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: eventDetails = {}, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      console.log('Raw event data from Supabase:', data);

      // Map the events to their corresponding types based on order
      const eventTypes: EventType[] = ["haldi", "mehndi", "mayra", "sangeet", "wedding"];
      const formattedEvents = data.reduce((acc: Record<EventType, EventDetails>, event, index) => {
        if (index < eventTypes.length) {
          acc[eventTypes[index]] = {
            date: event.date,
            time: event.time,
            venue: event.venue,
            background_url: event.background_url,
            main_background_url: event.main_background_url,
          };
        }
        return acc;
      }, {} as Record<EventType, EventDetails>);

      // Initialize all event types with default values if they don't exist
      eventTypes.forEach(eventType => {
        if (!formattedEvents[eventType]) {
          formattedEvents[eventType] = {
            date: new Date().toISOString(),
            time: "",
            venue: "",
            background_url: null,
            main_background_url: null,
          };
        }
      });

      console.log('Formatted events:', formattedEvents);
      return formattedEvents;
    }
  });

  const addEventMutation = useMutation({
    mutationFn: async (events: Record<EventType, EventDetails>) => {
      const eventsToInsert = Object.entries(events).map(([eventType, details]) => ({
        event_name: eventType.charAt(0).toUpperCase() + eventType.slice(1),
        date: typeof details.date === 'string' ? details.date : details.date.toISOString(),
        time: details.time,
        venue: details.venue,
        background_url: details.background_url,
        main_background_url: details.main_background_url,
      }));

      const { error } = await supabase
        .from('events')
        .insert(eventsToInsert);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Events Added",
        description: "Event details have been successfully saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add events: " + error.message,
        variant: "destructive",
      });
    }
  });

  return {
    eventDetails: eventDetails as Record<EventType, EventDetails>,
    isLoading,
    addEvents: (events: Record<EventType, EventDetails>) => addEventMutation.mutate(events),
  };
};