import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RefreshCw, Heart, ClipboardList } from "lucide-react";
import { AdminButton } from "@/components/AdminButton";
import { DownloadApkButton } from "@/components/DownloadApkButton";
import { useIsMobile } from "@/hooks/use-mobile";

interface ActionButtonsProps {
  isRefreshing: boolean;
  onRefresh: () => void;
}

export const ActionButtons = ({ isRefreshing, onRefresh }: ActionButtonsProps) => {
  const isMobile = useIsMobile();

  return (
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
      <DownloadApkButton />
      <AdminButton />
    </div>
  );
};