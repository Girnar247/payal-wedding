import { EventType, EventDetails } from "@/types/guest";
import { Card } from "./ui/card";
import { format, parseISO } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { ChevronDown, ChevronUp, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";

interface EventSummaryProps {
  events: Record<EventType, EventDetails>;
}

export const EventSummary = ({ events }: EventSummaryProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  const { data: guestCounts = {}, isLoading } = useQuery({
    queryKey: ['eventGuestCounts'],
    queryFn: async () => {
      const { data: guests, error } = await supabase
        .from('guests')
        .select('events, plus_count, rsvp_status');

      if (error) throw error;

      const counts: Record<string, number> = {};
      guests.forEach((guest) => {
        if (guest.rsvp_status === 'confirmed') {
          const totalGuests = 1 + (guest.plus_count || 0);
          guest.events.forEach((event: string) => {
            counts[event] = (counts[event] || 0) + totalGuests;
          });
        }
      });

      return counts;
    }
  });

  const handleBackgroundUpload = async (event: React.ChangeEvent<HTMLInputElement>, eventType: string) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${eventType}/${crypto.randomUUID()}.${fileExt}`;

      setUploading(eventType);

      // Upload image to storage
      const { error: uploadError } = await supabase.storage
        .from('event-backgrounds')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: publicUrl } = supabase.storage
        .from('event-backgrounds')
        .getPublicUrl(filePath);

      // Update event record with new background URL
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
      <Button
        variant="ghost"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between p-4 bg-white/50 hover:bg-white/80 rounded-lg shadow-sm transition-all duration-300 mb-4"
      >
        <h2 className="text-2xl font-playfair">Event Schedule</h2>
        {isCollapsed ? (
          <ChevronDown className="h-6 w-6 transition-transform duration-200" />
        ) : (
          <ChevronUp className="h-6 w-6 transition-transform duration-200" />
        )}
      </Button>
      
      {!isCollapsed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {(Object.entries(events) as [EventType, EventDetails][])
            .sort((a, b) => {
              const dateA = a[1].date instanceof Date ? a[1].date : parseISO(a[1].date as string);
              const dateB = b[1].date instanceof Date ? b[1].date : parseISO(b[1].date as string);
              return dateA.getTime() - dateB.getTime();
            })
            .map(([eventType, details]) => (
              <Card 
                key={eventType} 
                className="p-4 relative overflow-hidden min-h-[200px] group"
                style={{
                  backgroundImage: details.background_url ? `url(${details.background_url})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="relative z-10 text-white">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-playfair capitalize text-lg">{eventType}</h3>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleBackgroundUpload(e, eventType)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploading === eventType}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-black/20 hover:bg-black/40"
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-white/90">
                      {format(
                        details.date instanceof Date ? details.date : parseISO(details.date as string),
                        'EEEE, MMMM d, yyyy'
                      )}
                    </p>
                    <p className="text-white/90">{details.time}</p>
                    <p className="text-white/90">{details.venue}</p>
                    <p className="text-white font-semibold mt-2">
                      Confirmed Guests: {guestCounts[eventType] || 0}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};