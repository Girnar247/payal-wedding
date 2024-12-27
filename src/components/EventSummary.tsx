import { EventType, EventDetails } from "@/types/guest";
import { Card } from "./ui/card";
import { format, parseISO } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface EventSummaryProps {
  events: Record<EventType, EventDetails>;
}

export const EventSummary = ({ events }: EventSummaryProps) => {
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
      <h2 className="text-2xl font-playfair mb-4 text-center">Event Schedule</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {(Object.entries(events) as [EventType, EventDetails][])
          .sort((a, b) => {
            const dateA = a[1].date instanceof Date ? a[1].date : parseISO(a[1].date as string);
            const dateB = b[1].date instanceof Date ? b[1].date : parseISO(b[1].date as string);
            return dateA.getTime() - dateB.getTime();
          })
          .map(([eventType, details]) => (
            <Card key={eventType} className="p-4 bg-white/50">
              <h3 className="font-playfair capitalize text-lg mb-2">{eventType}</h3>
              <div className="space-y-1 text-sm">
                <p className="text-gray-600">
                  {format(
                    details.date instanceof Date ? details.date : parseISO(details.date as string),
                    'EEEE, MMMM d, yyyy'
                  )}
                </p>
                <p className="text-gray-600">{details.time}</p>
                <p className="text-gray-600">{details.venue}</p>
                <p className="text-gray-600 font-semibold mt-2">
                  Confirmed Guests: {guestCounts[eventType] || 0}
                </p>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
};