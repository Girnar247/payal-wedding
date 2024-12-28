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
        {/* Venue Header */}
        <div className="space-y-2 text-center mb-6">
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
        
        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <img 
              src={venueDetails.aerialImage} 
              alt="Aerial view of Agarwal Hotel & Resort"
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
          </div>
          
          <div>
            <a 
              href={venueDetails.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <img 
                src="/lovable-uploads/a8572afe-4d1b-4f62-aeba-35179b1a9a08.png"
                alt="Map location of Agarwal Hotel & Resort"
                className="w-full h-48 object-cover rounded-lg shadow-md transition-transform group-hover:scale-[1.02]"
              />
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
};