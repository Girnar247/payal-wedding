import { useState, useEffect, useMemo } from "react";
import { EventType, EventDetails } from "@/types/guest";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Upload, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EventCard } from "./event-summary/EventCard";
import { MainBackgroundUpload } from "./event-summary/MainBackgroundUpload";
import { parseISO } from "date-fns";
import { useAdmin } from "@/contexts/AdminContext";
import { useGuestState } from "@/hooks/useGuestState";
import { useIsMobile } from "@/hooks/use-mobile";

interface EventSummaryProps {
  events: Record<EventType, EventDetails>;
}

export const EventSummary = ({ events }: EventSummaryProps) => {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const [uploading, setUploading] = useState<string | null>(null);
  const { isAdmin } = useAdmin();
  const { guests } = useGuestState();

  useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);

  // Memoize sorted events to prevent unnecessary recalculations
  const sortedEvents = useMemo(() => {
    return Object.entries(events).sort((a, b) => {
      const dateA = a[1].date instanceof Date ? a[1].date : parseISO(a[1].date as string);
      const dateB = b[1].date instanceof Date ? b[1].date : parseISO(b[1].date as string);
      return dateA.getTime() - dateB.getTime();
    });
  }, [events]);

  const handleBackgroundUpload = async (event: React.ChangeEvent<HTMLInputElement>, eventType: string) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      const file = event.target.files[0];
      
      // Add file size check
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Error",
          description: "File size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const sanitizedEventType = eventType.replace(/\s+/g, '_');
      const filePath = `${sanitizedEventType}/${crypto.randomUUID()}.${fileExt}`;

      setUploading(eventType);

      const { error: uploadError } = await supabase.storage
        .from('event-backgrounds')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrl } = supabase.storage
        .from('event-backgrounds')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('events')
        .update({ background_url: publicUrl.publicUrl })
        .eq('type', eventType);

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
        {isAdmin && <MainBackgroundUpload onUpload={(e) => handleBackgroundUpload(e, 'wedding')} />}
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