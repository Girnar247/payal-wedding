import { Badge } from "@/components/ui/badge";
import { Guest } from "@/types/guest";

interface GuestBadgesProps {
  guest: Guest;
}

export const GuestBadges = ({ guest }: GuestBadgesProps) => {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Badge
          variant={
            guest.rsvp_status === "confirmed"
              ? "default"
              : guest.rsvp_status === "declined"
              ? "destructive"
              : "secondary"
          }
          className="capitalize"
        >
          {guest.rsvp_status}
        </Badge>
        {guest.plus_count > 0 && (
          <Badge variant="outline" className="bg-wedding-rose/20">
            +{guest.plus_count}
          </Badge>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {guest.events?.map((event) => (
          <Badge key={event} variant="outline" className="capitalize">
            {event}
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {guest.attributes?.map((attr) => (
          <Badge key={attr} variant="secondary" className="capitalize">
            {attr}
          </Badge>
        ))}
      </div>
    </div>
  );
};