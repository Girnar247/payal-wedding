import { MapPin, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";

interface VenueDetailsProps {
  venueDetails: {
    name: string;
    address: string;
    mapsLink: string;
    aerialImage: string;
    mapPreviewUrl: string;
  };
}

export const VenueDetails = ({ venueDetails }: VenueDetailsProps) => {
  return (
    <Card className="p-6 bg-white/80 hover:bg-white transition-colors">
      <div className="space-y-6">
        <div className="flex items-center justify-center">
          <MapPin className="h-6 w-6 text-wedding-accent" />
        </div>
        <h3 className="text-xl font-playfair text-center">Main Venue</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <img 
              src={venueDetails.aerialImage} 
              alt="Aerial view of Agarwal Hotel & Resort"
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
            <p className="text-sm text-wedding-text/70 text-center">Aerial View</p>
          </div>
          
          <div className="space-y-2">
            <img 
              src={venueDetails.mapPreviewUrl}
              alt="Map location of Agarwal Hotel & Resort"
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
            <p className="text-sm text-wedding-text/70 text-center">Location Map</p>
          </div>
        </div>

        <div className="space-y-2 text-center">
          <p className="font-medium text-lg">{venueDetails.name}</p>
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