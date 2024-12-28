import { memo, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { format, parseISO } from "date-fns";
import { EventType, EventDetails, Guest } from "@/types/guest";
import { useAdmin } from "@/contexts/AdminContext";

interface EventCardProps {
  eventType: EventType;
  details: EventDetails;
  guests: Guest[];
  onBackgroundUpload: (event: React.ChangeEvent<HTMLInputElement>, eventType: string) => void;
  uploading: string | null;
}

export const EventCard = memo(({ eventType, details, guests, onBackgroundUpload, uploading }: EventCardProps) => {
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();

  // Memoize guest count calculation
  const confirmedGuestCount = useMemo(() => {
    return guests.reduce((acc, guest) => {
      if (guest.rsvp_status === "confirmed" && guest.events?.includes(eventType)) {
        return acc + 1 + (guest.plus_count || 0);
      }
      return acc;
    }, 0);
  }, [guests, eventType]);

  // Memoize card click handler
  const handleCardClick = useCallback(() => {
    if (eventType === "mayra") {
      navigate("/mayra");
    }
  }, [eventType, navigate]);

  // Memoize date formatting
  const formattedDate = useMemo(() => {
    return format(
      details.date instanceof Date ? details.date : parseISO(details.date as string),
      'EEEE, MMMM d, yyyy'
    );
  }, [details.date]);

  return (
    <Card 
      className="p-4 relative overflow-hidden min-h-[200px] group bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-300"
      onClick={handleCardClick}
    >
      <div className="relative z-10 text-wedding-text">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-playfair capitalize text-lg font-bold">{eventType}</h3>
          {isAdmin && (
            <div className="relative">
              <input
                type="file"
                id={`background-${eventType}`}
                className="hidden"
                accept="image/*"
                onChange={(e) => onBackgroundUpload(e, eventType)}
                disabled={!!uploading}
              />
              <label htmlFor={`background-${eventType}`}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </label>
            </div>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-medium">{formattedDate}</p>
          <p>{details.time}</p>
          <p>{details.venue}</p>
          {confirmedGuestCount > 0 && (
            <p className="text-xs text-wedding-text/70">
              {confirmedGuestCount} confirmed guest{confirmedGuestCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
});

EventCard.displayName = 'EventCard';