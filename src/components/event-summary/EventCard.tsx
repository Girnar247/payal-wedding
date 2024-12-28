import { EventType, EventDetails, Guest } from "@/types/guest";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useAdmin } from "@/contexts/AdminContext";

interface EventCardProps {
  eventType: EventType;
  details: EventDetails;
  guests: Guest[];
  onBackgroundUpload: (event: React.ChangeEvent<HTMLInputElement>, eventType: string) => Promise<void>;
  uploading: string | null;
}

export const EventCard = ({ 
  eventType, 
  details, 
  guests,
  onBackgroundUpload, 
  uploading 
}: EventCardProps) => {
  const { isAdmin } = useAdmin();
  
  console.log(`Background URL for ${eventType}:`, details.background_url);
  
  const confirmedGuestCount = guests?.reduce((acc, guest) => {
    if (guest.rsvp_status === "confirmed" && guest.events.includes(eventType)) {
      return acc + 1 + (guest.plus_count || 0);
    }
    return acc;
  }, 0) || 0;

  const backgroundStyle = details.background_url ? {
    backgroundImage: `url('${details.background_url}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } : {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  };

  return (
    <Card 
      className="p-4 relative overflow-hidden min-h-[200px] group"
      style={backgroundStyle}
    >
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
      <div className="absolute inset-0 bg-white/60" /> {/* Add 60% white overlay */}
      <div className="relative z-10 text-wedding-text">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-playfair capitalize text-lg">{eventType}</h3>
          {isAdmin && (
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onBackgroundUpload(e, eventType)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploading === eventType}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-black/20 hover:bg-black/40"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <div className="space-y-1 text-sm">
          <p className="text-wedding-text/90">
            {format(
              details.date instanceof Date ? details.date : parseISO(details.date as string),
              'EEEE, MMMM d, yyyy'
            )}
          </p>
          <p className="text-wedding-text/90">{details.time}</p>
          <p className="text-wedding-text/90">{details.venue}</p>
          <p className="text-wedding-text font-semibold mt-2">
            Confirmed Guests: {confirmedGuestCount}
          </p>
        </div>
      </div>
    </Card>
  );
};