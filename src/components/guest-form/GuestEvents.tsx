import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { EventType } from "@/types/guest";

interface GuestEventsProps {
  selectedEvents: EventType[];
  onEventsChange: (events: EventType[]) => void;
}

export const GuestEvents = ({ selectedEvents, onEventsChange }: GuestEventsProps) => {
  const eventTypes: EventType[] = ["haldi", "mehndi", "mayra", "sangeet", "wedding"];

  const handleAllEventsChange = (checked: boolean) => {
    onEventsChange(checked ? eventTypes : []);
  };

  const isAllEventsSelected = selectedEvents.length === eventTypes.length;

  return (
    <div className="space-y-2">
      <Label>Events Attending *</Label>
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="all-events"
            checked={isAllEventsSelected}
            onCheckedChange={handleAllEventsChange}
          />
          <Label htmlFor="all-events">All Events</Label>
        </div>
        {eventTypes.map((event) => (
          <div key={event} className="flex items-center space-x-2">
            <Checkbox
              id={event}
              checked={selectedEvents.includes(event)}
              onCheckedChange={(checked) =>
                onEventsChange(
                  checked
                    ? [...selectedEvents, event]
                    : selectedEvents.filter((e) => e !== event)
                )
              }
            />
            <Label htmlFor={event} className="capitalize">
              {event}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};