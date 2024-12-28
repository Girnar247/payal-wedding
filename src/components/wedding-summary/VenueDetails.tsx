import { MapPin, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";

interface VenueDetailsProps {
  venueDetails: {
    name: string;
    address: string;
    mapsLink: string;
    aerialImage?: string;
    mapPreviewUrl?: string;
  };
}

export const VenueDetails = ({ venueDetails }: VenueDetailsProps) => {
  return (
    <Card className="p-6 bg-white/80 hover:bg-white transition-colors">
      <div className="space-y-4">
        <div className="space-y-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <MapPin className="h-6 w-6 text-wedding-accent" />
            <h3 className="text-xl font-playfair">Main Venue: {venueDetails.name}</h3>
          </div>
          <p className="text-wedding-text/80">{venueDetails.address}</p>
          <a 
            href={venueDetails.mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-wedding-accent hover:text-wedding-text transition-colors"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            View on Google Maps
          </a>
        </div>
      </div>
    </Card>
  );
};