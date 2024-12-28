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
  // Create a custom map URL with a marker pin
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=25.1507,75.8524&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7Clabel:V%7C25.1507,75.8524&key=AIzaSyDHVtZNNF5mYqzRWLYZyt-BZSFsUxj_Uoc&style=feature:poi|visibility:off`;

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
            <a 
              href={venueDetails.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <img 
                src={mapUrl}
                alt="Map location of Agarwal Hotel & Resort"
                className="w-full h-48 object-cover rounded-lg shadow-md transition-transform group-hover:scale-[1.02]"
              />
              <p className="text-sm text-wedding-text/70 text-center group-hover:text-wedding-accent transition-colors">
                Location Map (Click to open in Google Maps)
              </p>
            </a>
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