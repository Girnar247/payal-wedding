import { Card } from "@/components/ui/card";
import { useEventState } from "@/hooks/useEventState";
import { EventType, EventDetails } from "@/types/guest";
import { BackButton } from "@/components/wedding-summary/BackButton";
import { WeddingHeader } from "@/components/wedding-summary/WeddingHeader";
import { VenueDetails } from "@/components/wedding-summary/VenueDetails";
import { EventCard } from "@/components/wedding-summary/EventCard";
import { NavigationLinks } from "@/components/wedding-summary/NavigationLinks";

const WeddingSummary = () => {
  const { eventDetails } = useEventState();

  const venueDetails = {
    name: "Agarwal Hotel & Resort",
    address: "Jaswant vihar, Bundi Rd, Kota, Rajasthan 324008",
    mapsLink: "https://maps.app.goo.gl/7kkEwVaR9CjGzLM67",
    aerialImage: "", // Removed for performance
    mapPreviewUrl: "" // Removed for performance
  };

  return (
    <div className="min-h-screen bg-wedding-cream">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <BackButton />
        </div>

        <Card className="p-8">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <WeddingHeader />
            <VenueDetails venueDetails={venueDetails} />

            <div className="h-px bg-wedding-accent/30 w-1/2 mx-auto" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {eventDetails && Object.entries(eventDetails as Record<EventType, EventDetails>).map(([type, details]) => (
                <EventCard 
                  key={type}
                  type={type as EventType}
                  details={details}
                />
              ))}
            </div>

            <NavigationLinks />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WeddingSummary;