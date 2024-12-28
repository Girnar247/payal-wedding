import { Card } from "@/components/ui/card";
import { Heart, MapPin } from "lucide-react";
import { EventType, EventDetails } from "@/types/guest";
import { format, parseISO } from "date-fns";

interface EventCardProps {
  type: EventType;
  details: EventDetails;
}

export const EventCard = ({ type, details }: EventCardProps) => {
  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 space-y-4">
      <div className="flex items-center justify-center">
        <Heart className="h-6 w-6 text-wedding-accent" />
      </div>
      <h3 className="text-xl font-playfair text-center capitalize">
        {type}
      </h3>
      <div className="space-y-2 text-sm text-center">
        <p className="font-medium">
          {format(
            details.date instanceof Date ? details.date : parseISO(details.date as string),
            'EEEE, MMMM d, yyyy'
          )}
        </p>
        <p>{details.time}</p>
        <div className="flex items-center justify-center space-x-1 text-wedding-text/80">
          <MapPin className="h-4 w-4" />
          <p>{details.venue}</p>
        </div>
      </div>
    </Card>
  );
};