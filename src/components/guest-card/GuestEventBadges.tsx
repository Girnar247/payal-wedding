import { EventType } from "@/types/guest";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface GuestEventBadgesProps {
  events: EventType[];
}

export const GuestEventBadges = ({ events }: GuestEventBadgesProps) => {
  const { data: eventNames } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('event_name')
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Create a mapping of event type to event name
      const nameMapping = data.reduce((acc: Record<string, string>, event) => {
        // Convert event_name to lowercase and remove spaces for the key
        const key = event.event_name.toLowerCase().replace(/\s+/g, '');
        acc[key] = event.event_name;
        return acc;
      }, {});

      return nameMapping;
    }
  });

  const getEventDisplayName = (event: EventType) => {
    if (eventNames && eventNames[event]) {
      return eventNames[event];
    }
    // Fallback to capitalized event type if no name is found
    return event.charAt(0).toUpperCase() + event.slice(1);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {events.map((event) => (
        <Badge key={event} variant="outline" className="text-wedding-text">
          {getEventDisplayName(event)}
        </Badge>
      ))}
    </div>
  );
};