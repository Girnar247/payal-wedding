import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { MainBackgroundUpload } from "./MainBackgroundUpload";
import { useAdmin } from "@/contexts/AdminContext";

interface EventScheduleHeaderProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  onMainBackgroundUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export const EventScheduleHeader = ({ 
  isCollapsed, 
  setIsCollapsed,
  onMainBackgroundUpload 
}: EventScheduleHeaderProps) => {
  const { isAdmin } = useAdmin();

  return (
    <div className="flex justify-between items-center mb-4">
      <Button
        variant="ghost"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex items-center justify-between p-4 bg-white/50 hover:bg-white/80 rounded-lg shadow-sm transition-all duration-300"
      >
        <h2 className="text-2xl font-playfair">Event Schedule</h2>
        {isCollapsed ? (
          <ChevronDown className="h-6 w-6 transition-transform duration-200" />
        ) : (
          <ChevronUp className="h-6 w-6 transition-transform duration-200" />
        )}
      </Button>
      {isAdmin && <MainBackgroundUpload onUpload={onMainBackgroundUpload} />}
    </div>
  );
};