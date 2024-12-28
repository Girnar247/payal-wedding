import { EventType, EventDetails } from "@/types/guest";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { EventCard } from "./event-summary/EventCard";
import { MainBackgroundUpload } from "./event-summary/MainBackgroundUpload";
import { parseISO } from "date-fns";

interface EventSummaryProps {
  events: Record<EventType, EventDetails>;
}

export const EventSummary = ({ events }: EventSummaryProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

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

  const handleMainBackgroundUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `main-background/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('event-backgrounds')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrl } = supabase.storage
        .from('event-backgrounds')
        .getPublicUrl(filePath);

      // Update each event type individually with the new main background URL
      const eventTypes = Object.keys(events);
      for (const eventType of eventTypes) {
        const { error: updateError } = await supabase
          .from('events')
          .update({ main_background_url: publicUrl.publicUrl })
          .eq('type', eventType);

        if (updateError) {
          throw updateError;
        }
      }

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
        <MainBackgroundUpload onUpload={handleMainBackgroundUpload} />
      </div>
      
      {!isCollapsed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {(Object.entries(events) as [EventType, EventDetails][])
            .sort((a, b) => {
              const dateA = a[1].date instanceof Date ? a[1].date : parseISO(a[1].date as string);
              const dateB = b[1].date instanceof Date ? b[1].date : parseISO(b[1].date as string);
              return dateA.getTime() - dateB.getTime();
            })
            .map(([eventType, details]) => (
              <EventCard
                key={eventType}
                eventType={eventType}
                details={details}
                guestCount={0}
                onBackgroundUpload={handleBackgroundUpload}
                uploading={uploading}
              />
            ))}
        </div>
      )}
    </div>
  );
};