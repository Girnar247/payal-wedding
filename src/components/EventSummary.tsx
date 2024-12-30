import { useState, useEffect } from "react";
import { EventType, EventDetails } from "@/types/guest";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EventCard } from "./event-summary/EventCard";
import { MainBackgroundUpload } from "./event-summary/MainBackgroundUpload";
import { useAdmin } from "@/contexts/AdminContext";
import { useGuestState } from "@/hooks/useGuestState";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";

interface EventSummaryProps {
  events: Record<EventType, EventDetails>;
}

export const EventSummary = ({ events }: EventSummaryProps) => {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const { isAdmin } = useAdmin();
  const { guests } = useGuestState();

  const { data: sortedEvents } = useQuery({
    queryKey: ['sorted-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
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

  const handleBackgroundUpload = async (event: React.ChangeEvent<HTMLInputElement>, eventType: string) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const sanitizedEventType = eventType.replace(/\s+/g, '_');
      const filePath = `${sanitizedEventType}/${crypto.randomUUID()}.${fileExt}`;

      setUploading(eventType);

      const { error: uploadError } = await supabase.storage
        .from('event-backgrounds')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrl } = supabase.storage
        .from('event-backgrounds')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('events')
        .update({ background_url: publicUrl.publicUrl })
        .eq('event_name', eventType);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Background Updated",
        description: "The event background has been successfully updated.",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload background image: " + error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(null);
    }
  };

  const handleMainBackgroundUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `main/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('event-backgrounds')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrl } = supabase.storage
        .from('event-backgrounds')
        .getPublicUrl(filePath);

      toast({
        title: "Main Background Updated",
        description: "The main background has been successfully updated.",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload main background image: " + error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="ghost"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-between p-4 bg-white/50 hover:bg-white/80 rounded-lg shadow-sm transition-all duration-300"
        >
          <h2 className="text-2xl font-playfair">Event Schedule</h2>
          {isCollapsed ? (
            <ChevronDown className="h-6 w-6 transition-transform duration-200" />
          ) : (
            <ChevronUp className="h-6 w-6 transition-transform duration-200" />
          )}
        </Button>
        {isAdmin && <MainBackgroundUpload onUpload={handleMainBackgroundUpload} />}
      </div>
      
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