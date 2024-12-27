import { Guest } from "@/types/guest";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

interface GuestRSVPStatusProps {
  status: "pending" | "confirmed" | "declined";
  guestId: string;
  onUpdateStatus: (id: string, status: "confirmed" | "declined") => void;
}

export const GuestRSVPStatus = ({ status, guestId, onUpdateStatus }: GuestRSVPStatusProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleStatusUpdate = async (newStatus: "confirmed" | "declined") => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .update({ rsvp_status: newStatus })
        .eq('id', guestId)
        .select();

      if (error) {
        console.error('Error updating status:', error);
        throw error;
      }

      onUpdateStatus(guestId, newStatus);
      toast({
        title: "Status Updated",
        description: `Guest status has been updated to ${newStatus}.`,
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