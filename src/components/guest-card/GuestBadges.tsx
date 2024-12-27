import { Badge } from "@/components/ui/badge";
import { EventType, GuestAttribute } from "@/types/guest";

interface GuestBadgesProps {
  rsvpStatus: "pending" | "confirmed" | "declined";
  plusCount: number;
  events: EventType[];
  attributes: GuestAttribute[];
}

export const GuestBadges = ({ rsvpStatus, plusCount, events, attributes }: GuestBadgesProps) => {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Badge
          variant={
            rsvpStatus === "confirmed"
              ? "default"
              : rsvpStatus === "declined"
              ? "destructive"
              : "secondary"
          }
          className="capitalize"
        >
          {rsvpStatus}
        </Badge>
        {plusCount > 0 && (
          <Badge variant="outline" className="bg-wedding-rose/20">
            +{plusCount}
          </Badge>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {events.map((event) => (
          <Badge key={event} variant="outline" className="capitalize">
            {event}
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {attributes.map((attr) => (
          <Badge key={attr} variant="secondary" className="capitalize">
            {attr}
          </Badge>
        ))}
      </div>
    </div>
  );
};