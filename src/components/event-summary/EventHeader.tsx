import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface EventHeaderProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  isAdmin: boolean;
  onMainBackgroundUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const EventHeader = ({
  isCollapsed,
  toggleCollapse,
  isAdmin,
  onMainBackgroundUpload,
}: EventHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <Button
        variant="ghost"
        onClick={toggleCollapse}
        className="flex items-center justify-between p-4 bg-white/50 hover:bg-white/80 rounded-lg shadow-sm transition-all duration-300"
      >
        <h2 className="text-2xl font-playfair">Event Schedule</h2>
        {isCollapsed ? (
          <ChevronDown className="h-6 w-6 transition-transform duration-200" />
        ) : (
          <ChevronUp className="h-6 w-6 transition-transform duration-200" />
        )}
      </Button>
      {isAdmin && (
        <input
          type="file"
          onChange={onMainBackgroundUpload}
          accept="image/*"
          className="hidden"
          id="main-background-upload"
        />
      )}
    </div>
  );
};