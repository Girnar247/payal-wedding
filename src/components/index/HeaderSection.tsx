import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ClipboardList, Heart, RefreshCw } from "lucide-react";
import { AdminButton } from "@/components/AdminButton";
import { EventDetails } from "@/types/guest";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderSectionProps {
  eventDetails: Record<string, EventDetails>;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export const HeaderSection = ({ eventDetails, isRefreshing, onRefresh }: HeaderSectionProps) => {
  const isMobile = useIsMobile();
  const mainBackgroundUrl = "https://vztjldlvnklafclbinnv.supabase.co/storage/v1/object/public/event-backgrounds/main-background/96777c07-eea8-4596-901c-7137315f7b01.webp";

  return (
    <div 
      className="bg-cover bg-center bg-no-repeat py-8 relative"
      style={{
        backgroundImage: `url(${mainBackgroundUrl})`,
      }}
    >
      <div className="absolute inset-0 bg-white/40" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left space-y-2 w-full md:w-auto">
            <h1 className="text-3xl md:text-5xl font-playfair text-wedding-text">
              Payal's Wedding - Guest List
            </h1>
            <p className="text-gray-600">Manage your special celebrations with elegance</p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-2 w-full md:w-auto">
            <Button 
              variant="outline" 
              className="bg-white/50 hover:bg-white/80"
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {!isMobile && "Refresh"}
            </Button>
            <Link to="/wedding-summary">
              <Button variant="outline" className="bg-white/50 hover:bg-white/80">
                <Heart className="h-4 w-4 mr-2" />
                {!isMobile && "Wedding Summary"}
              </Button>
            </Link>
            <Link to="/tasks">
              <Button variant="outline" className="bg-white/50 hover:bg-white/80">
                <ClipboardList className="h-4 w-4 mr-2" />
                {!isMobile && "Tasks"}
              </Button>
            </Link>
            <AdminButton />
          </div>
        </div>
      </div>
    </div>
  );
};