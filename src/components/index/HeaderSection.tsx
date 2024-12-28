import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClipboardList, Heart, RefreshCw } from "lucide-react";
import { AdminButton } from "@/components/AdminButton";
import { EventDetails } from "@/types/guest";

interface HeaderSectionProps {
  eventDetails: Record<string, EventDetails>;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export const HeaderSection = ({ eventDetails, isRefreshing, onRefresh }: HeaderSectionProps) => {
  return (
    <div 
      className="bg-cover bg-center bg-no-repeat py-8 relative"
      style={{
        backgroundImage: eventDetails?.wedding?.main_background_url ? 
          `url(${eventDetails.wedding.main_background_url})` : 'none',
      }}
    >
      <div className="absolute inset-0 bg-white/40" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <div className="flex justify-between items-center">
          <div className="text-center space-y-2">
            <h1 className="text-4xl md:text-5xl font-playfair text-wedding-text">
              Payal's Wedding - Guest List
            </h1>
            <p className="text-gray-600">Manage your special celebrations with elegance</p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="bg-white/50 hover:bg-white/80"
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Link to="/wedding-summary">
              <Button variant="outline" className="bg-white/50 hover:bg-white/80">
                <Heart className="h-4 w-4 mr-2" />
                Wedding Summary
              </Button>
            </Link>
            <Link to="/tasks">
              <Button variant="outline" className="bg-white/50 hover:bg-white/80">
                <ClipboardList className="h-4 w-4 mr-2" />
                Tasks
              </Button>
            </Link>
            <AdminButton />
          </div>
        </div>
      </div>
    </div>
  );
};