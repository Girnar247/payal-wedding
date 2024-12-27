import { EventType, EventDetails } from "@/types/guest";
import { Card } from "./ui/card";
import { format, parseISO } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";

interface EventSummaryProps {
  events: Record<EventType, EventDetails>;
}

export const EventSummary = ({ events }: EventSummaryProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { data: guestCounts = {} } = useQuery({
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
                  <h3 className="font-playfair capitalize text-lg mb-2">{eventType}</h3>
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