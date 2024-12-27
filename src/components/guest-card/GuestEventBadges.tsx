import { EventType } from "@/types/guest";
import { Badge } from "@/components/ui/badge";

interface GuestEventBadgesProps {
  events: EventType[];
}

export const GuestEventBadges = ({ events }: GuestEventBadgesProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {events.map((event) => (
        <Badge key={event} variant="outline" className="capitalize">
          {event}
        </Badge>
      ))}
    </div>
  );
};