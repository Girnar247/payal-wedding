import { Guest } from "@/types/guest";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface GuestRSVPStatusProps {
  guest: Guest;
  onUpdateStatus: (id: string, status: "confirmed" | "declined" | "pending") => void;
}

export const GuestRSVPStatus = ({ guest, onUpdateStatus }: GuestRSVPStatusProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleStatusUpdate = async (status: "confirmed" | "declined" | "pending") => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .update({ rsvp_status: status })
        .eq('id', guest.id)
        .select();

      if (error) {
        console.error('Error updating status:', error);
        throw error;
      }

      onUpdateStatus(guest.id, status);
      toast({
        title: "Status Updated",
        description: `Guest status has been updated to ${status}.`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update guest status.",
        variant: "destructive",
      });
    }
  };

  return null; // This component only handles the logic, UI is in GuestActions
};
