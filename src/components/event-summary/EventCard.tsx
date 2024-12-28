import { EventType, EventDetails, Guest } from "@/types/guest";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useAdmin } from "@/contexts/AdminContext";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  
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
  } : {};

  const handleCardClick = () => {
    if (eventType === "mayra") {
      navigate("/mayra");
    }
  };

  return (
    <Card 
      className={`p-4 relative overflow-hidden min-h-[200px] group bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 ${eventType === "mayra" ? "cursor-pointer" : ""}`}
      style={backgroundStyle}
      onClick={handleCardClick}
    >
      {details.background_url && <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />}
      <div className="relative z-10 text-wedding-text">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-playfair capitalize text-lg font-bold">{eventType}</h3>
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
          <p className="text-wedding-text font-medium">
            {format(
              details.date instanceof Date ? details.date : parseISO(details.date as string),
              'EEEE, MMMM d, yyyy'
            )}
          </p>
          <p className="text-wedding-text font-medium">{details.time}</p>
          <p className="text-wedding-text font-medium">{details.venue}</p>
          {eventType !== "mayra" && (
            <p className="text-wedding-text font-bold mt-2">
              Confirmed Guests: {confirmedGuestCount}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};