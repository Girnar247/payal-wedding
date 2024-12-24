import { Calendar } from "./ui/calendar";
import { Card } from "./ui/card";
import { EventDetails, EventType } from "@/types/guest";

interface EventCalendarProps {
  events: Record<EventType, EventDetails>;
}

export const EventCalendar = ({ events }: EventCalendarProps) => {
  const eventDates = Object.values(events).map((event) => event.date);

  return (
    <Card className="p-6 glass-card">
      <h2 className="text-2xl font-playfair mb-4">Event Calendar</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Calendar
          mode="multiple"
          selected={eventDates}
          className="rounded-md border"
        />
        <div className="space-y-4">
          {(Object.entries(events) as [EventType, EventDetails][]).map(
            ([event, details]) => (
              <div key={event} className="p-4 bg-white/50 rounded-lg">
                <h3 className="font-playfair capitalize text-lg">{event}</h3>
                <p className="text-sm text-gray-600">
                  Date: {details.date.toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">Time: {details.time}</p>
                <p className="text-sm text-gray-600">Venue: {details.venue}</p>
              </div>
            )
          )}
        </div>
      </div>
    </Card>
  );
};