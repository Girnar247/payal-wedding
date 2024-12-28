import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { EventType, EventDetails } from "@/types/guest";
import { Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { parseISO } from "date-fns";
import { useAdmin } from "@/contexts/AdminContext";
import { useGuestState } from "@/hooks/useGuestState";
import { useIsMobile } from "@/hooks/use-mobile";
import { EventHeader } from "./event-summary/EventHeader";
import { EventGrid } from "./event-summary/EventGrid";

interface EventSummaryProps {
  events: Record<EventType, EventDetails>;
}

const EventSummaryComponent = ({ events }: EventSummaryProps) => {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const [uploading, setUploading] = useState<string | null>(null);
  const { isAdmin } = useAdmin();
  const { guests } = useGuestState();

  useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  const sortedEvents = useMemo(() => {
    return Object.entries(events).sort((a, b) => {
      const dateA = a[1].date instanceof Date ? a[1].date : parseISO(a[1].date as string);
      const dateB = b[1].date instanceof Date ? b[1].date : parseISO(b[1].date as string);
      return dateA.getTime() - dateB.getTime();
    });
  }, [events]);

  const handleBackgroundUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>, eventType: string) => {
    if (!event.target.files?.length) return;
    
    const file = event.target.files[0];
    if (file.size > 500 * 1024) {
      toast({
        title: "Error",
        description: "File size should be less than 500KB",
        variant: "destructive",
      });
      return;
    }

    try {
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

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from('event-backgrounds')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('events')
        .update({ background_url: publicUrl.publicUrl })
        .eq('type', eventType);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Background updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload background image",
        variant: "destructive",
      });
    } finally {
      setUploading(null);
    }
  }, []);

  return (
    <div className="mb-8">
      <EventHeader
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
        isAdmin={isAdmin}
        onMainBackgroundUpload={(e) => handleBackgroundUpload(e, 'wedding')}
      />
      
      {!isCollapsed && (
        <EventGrid
          sortedEvents={sortedEvents}
          guests={guests}
          onBackgroundUpload={handleBackgroundUpload}
          uploading={uploading}
        />
      )}
    </div>
  );
};

export const EventSummary = memo(EventSummaryComponent);