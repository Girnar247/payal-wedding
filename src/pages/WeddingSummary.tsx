import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Heart, MapPin, ArrowLeft, ExternalLink } from "lucide-react";
import { useEventState } from "@/hooks/useEventState";
import { format, parseISO } from "date-fns";
import { EventType, EventDetails } from "@/types/guest";

const WeddingSummary = () => {
  const { eventDetails } = useEventState();

  const venueDetails = {
    name: "Agarwal Hotel & Resort",
    address: "Jaswant vihar, Bundi Rd, Kota, Rajasthan 324008",
    mapsLink: "https://maps.app.goo.gl/7kkEwVaR9CjGzLM67",
    aerialImage: "/lovable-uploads/5a9e59b4-c0be-4289-8c54-b0738c7d7730.png",
    // Using Google Maps Static API to show a preview
    mapPreviewUrl: `https://maps.googleapis.com/maps/api/staticmap?center=Agarwal+Hotel+and+Resort+Kota&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7CAgarwal+Hotel+and+Resort+Kota&key=YOUR_GOOGLE_MAPS_API_KEY`
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: eventDetails?.wedding?.main_background_url ? 
          `url(${eventDetails.wedding.main_background_url})` : 'none'
      }}
    >
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 py-12">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/">
            <Button variant="outline" className="bg-white/80 hover:bg-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <Card className="p-8 bg-white/90 backdrop-blur-sm">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-playfair text-wedding-text animate-fadeIn">
                Payal Weds Pranai
              </h1>
              <div className="flex items-center justify-center space-x-2 text-wedding-text/80">
                <Calendar className="h-5 w-5" />
                <p className="text-xl font-inter">01.03.2025 - 02.03.2025</p>
              </div>
            </div>

            {/* Venue Details Card */}
            <Card className="p-6 bg-white/80 hover:bg-white transition-colors">
              <div className="space-y-6">
                <div className="flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-wedding-accent" />
                </div>
                <h3 className="text-xl font-playfair text-center">Main Venue</h3>
                
                {/* Venue Images */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Aerial View */}
                  <div className="space-y-2">
                    <img 
                      src={venueDetails.aerialImage} 
                      alt="Aerial view of Agarwal Hotel & Resort"
                      className="w-full h-48 object-cover rounded-lg shadow-md"
                    />
                    <p className="text-sm text-wedding-text/70 text-center">Aerial View</p>
                  </div>
                  
                  {/* Map Preview */}
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

            <div className="h-px bg-wedding-accent/30 w-1/2 mx-auto" />

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {eventDetails && Object.entries(eventDetails as Record<EventType, EventDetails>).map(([type, details]) => (
                <Card 
                  key={type}
                  className="p-6 bg-white/80 hover:bg-white transition-colors space-y-4"
                >
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
              ))}
            </div>

            {/* Navigation Links */}
            <div className="flex justify-center gap-4 mt-8">
              <Link to="/tasks">
                <Button variant="outline" className="bg-white/80 hover:bg-white">
                  View Tasks
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="bg-white/80 hover:bg-white">
                  Manage Guest List
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WeddingSummary;