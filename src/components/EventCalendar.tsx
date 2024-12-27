import { Calendar } from "./ui/calendar";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { EventDetails, EventType } from "@/types/guest";
import { parseISO, format } from "date-fns";

interface EventCalendarProps {
  events: Record<EventType, EventDetails>;
  onUpdateEvent?: (eventType: EventType, details: EventDetails) => void;
  editable?: boolean;
}

export const EventCalendar = ({ events, onUpdateEvent, editable = false }: EventCalendarProps) => {
  const eventDates = Object.values(events).map((event) => 
    event.date instanceof Date ? event.date : parseISO(event.date as string)
  );

  const handleUpdateEvent = (
    eventType: EventType,
    field: keyof EventDetails,
    value: string | Date
  ) => {
    if (onUpdateEvent) {
      const updatedDetails = {
        ...events[eventType],
        [field]: value,
      };
      onUpdateEvent(eventType, updatedDetails);
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : parseISO(date as string);
    return format(dateObj, 'MMMM d, yyyy');
  };

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
                <div className="space-y-2">
                  <div>
                    <Label>Date</Label>
                    {editable ? (
                      <Calendar
                        mode="single"
                        selected={details.date instanceof Date ? details.date : parseISO(details.date as string)}
                        onSelect={(date) => date && handleUpdateEvent(event, "date", date)}
                        className="rounded-md border"
                      />
                    ) : (
                      <p className="text-sm text-gray-600">
                        {formatDate(details.date)}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Time</Label>
                    {editable ? (
                      <Input
                        type="time"
                        value={details.time}
                        onChange={(e) => handleUpdateEvent(event, "time", e.target.value)}
                        className="bg-white/50"
                      />
                    ) : (
                      <p className="text-sm text-gray-600">{details.time}</p>
                    )}
                  </div>
                  <div>
                    <Label>Venue</Label>
                    {editable ? (
                      <Input
                        type="text"
                        value={details.venue}
                        onChange={(e) => handleUpdateEvent(event, "venue", e.target.value)}
                        className="bg-white/50"
                      />
                    ) : (
                      <p className="text-sm text-gray-600">{details.venue}</p>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </Card>
  );
};