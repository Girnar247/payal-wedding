import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";
import { MainBackgroundUpload } from "./MainBackgroundUpload";
import { useAdmin } from "@/contexts/AdminContext";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = async () => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ is_visible: !isVisible })
        .eq('event_type', 'wedding');  // Update all events

      if (error) throw error;

      setIsVisible(!isVisible);
      toast({
        title: "Success",
        description: `Event schedule is now ${!isVisible ? 'visible' : 'hidden'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update visibility",
        variant: "destructive",
      });
    }
  };

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
      <div className="flex gap-2">
        {isAdmin && (
          <Button
            variant="outline"
            onClick={toggleVisibility}
            className="bg-white/50 hover:bg-white/80"
          >
            {isVisible ? (
              <Eye className="h-4 w-4 mr-2" />
            ) : (
              <EyeOff className="h-4 w-4 mr-2" />
            )}
            {isVisible ? 'Hide Schedule' : 'Show Schedule'}
          </Button>
        )}
        {isAdmin && <MainBackgroundUpload onUpload={onMainBackgroundUpload} />}
      </div>
    </div>
  );
};