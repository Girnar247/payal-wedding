import { EventType } from "@/types/guest";
import { Badge } from "@/components/ui/badge";

interface GuestEventBadgesProps {
  events: EventType[];
}

export const GuestEventBadges = ({ events }: GuestEventBadgesProps) => {
  const getEventDisplayName = (event: EventType) => {
    switch (event) {
      case "haldi":
        return "Haldi";
      case "mehndi":
        return "Mehndi";
      case "mayra":
        return "Mayra";
      case "sangeet":
        return "Sangeet";
      case "wedding":
        return "Wedding";
      default:
        return event;
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {events.map((event) => (
        <Badge key={event} variant="outline" className="text-wedding-text">
          {getEventDisplayName(event)}
        </Badge>
      ))}
    </div>
  );
};