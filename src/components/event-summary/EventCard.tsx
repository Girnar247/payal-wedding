import { EventType, EventDetails } from "@/types/guest";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { format, parseISO } from "date-fns";

interface EventCardProps {
  eventType: EventType;
  details: EventDetails;
  guestCount: number;
  onBackgroundUpload: (event: React.ChangeEvent<HTMLInputElement>, eventType: string) => Promise<void>;
  uploading: string | null;
}

export const EventCard = ({ eventType, details, guestCount, onBackgroundUpload, uploading }: EventCardProps) => {
  return (
    <Card 
      className="p-4 relative overflow-hidden min-h-[200px] group bg-cover bg-center"
      style={{
        backgroundImage: details.background_url ? `url(${details.background_url})` : 'none',
      }}
    >
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
      <div className="relative z-10 text-white">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-playfair capitalize text-lg">{eventType}</h3>
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
        </div>
        <div className="space-y-1 text-sm">
          <p className="text-white/90">
            {format(
              details.date instanceof Date ? details.date : parseISO(details.date as string),
              'EEEE, MMMM d, yyyy'
            )}
          </p>
          <p className="text-white/90">{details.time}</p>
          <p className="text-white/90">{details.venue}</p>
          <p className="text-white font-semibold mt-2">
            Confirmed Guests: {guestCount}
          </p>
        </div>
      </div>
    </Card>
  );
};