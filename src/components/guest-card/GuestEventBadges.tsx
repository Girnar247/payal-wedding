import { EventType } from "@/types/guest";
import { Badge } from "@/components/ui/badge";

interface GuestEventBadgesProps {
  events: EventType[];
}

export const GuestEventBadges = ({ events }: GuestEventBadgesProps) => {
  const getEventDisplayName = (event: EventType) => {
    const displayNames: Record<EventType, string> = {
      haldi: "Haldi",
      mehndi: "Mehndi",
      mayra: "Mayra",
      sangeet: "Sangeet",
      wedding: "Wedding"
    };
    return displayNames[event] || event;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {events.map((event) => (
        <Badge key={event} variant="outline" className="text-wedding-text capitalize">
          {getEventDisplayName(event)}
        </Badge>
      ))}
    </div>
  );
};