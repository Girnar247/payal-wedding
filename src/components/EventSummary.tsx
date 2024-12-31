import { useState, useEffect } from "react";
import { EventType, EventDetails } from "@/types/guest";
import { supabase } from "@/integrations/supabase/client";
import { EventCard } from "./event-summary/EventCard";
import { useGuestState } from "@/hooks/useGuestState";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { EventScheduleHeader } from "./event-summary/EventScheduleHeader";
import { useBackgroundUpload } from "./event-summary/useBackgroundUpload";

interface EventSummaryProps {
  events: Record<EventType, EventDetails>;
}

export const EventSummary = ({ events }: EventSummaryProps) => {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { guests } = useGuestState();
  const { uploading, handleBackgroundUpload, handleMainBackgroundUpload } = useBackgroundUpload();

  const { data: sortedEvents, isLoading } = useQuery({
    queryKey: ['sorted-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_visible', true)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching sorted events:', error);
        return Object.entries(events);
      }

      return data.map(event => {
        const eventType = event.event_name.toLowerCase().replace(/\s+/g, '') as EventType;
        return [eventType, events[eventType]] as [EventType, EventDetails];
      });
    },
    initialData: Object.entries(events) as [EventType, EventDetails][],
  });

  useEffect(() => {
    setIsCollapsed(true);
  }, [isMobile]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mb-8">
      <EventScheduleHeader
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        onMainBackgroundUpload={handleMainBackgroundUpload}
      />
      
      {!isCollapsed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {sortedEvents.map(([eventType, details]) => (
            <EventCard
              key={eventType}
              eventType={eventType as EventType}
              details={details}
              guests={guests}
              onBackgroundUpload={handleBackgroundUpload}
              uploading={uploading}
            />
          ))}
        </div>
      )}
    </div>
  );
};