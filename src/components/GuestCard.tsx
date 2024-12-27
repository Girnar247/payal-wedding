import { Guest, Host } from "@/types/guest";
import { Card, CardContent, CardHeader } from "./ui/card";
import { GuestEditDialog } from "./guest-card/GuestEditDialog";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { GuestHeader } from "./guest-card/GuestHeader";
import { GuestHostInfo } from "./guest-card/GuestHostInfo";
import { GuestEventBadges } from "./guest-card/GuestEventBadges";
import { GuestContactInfo } from "./guest-card/GuestContactInfo";

interface GuestCardProps {
  guest: Guest;
  host: Host;
  onEdit?: () => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: "confirmed" | "declined" | "pending") => void;
}

export const GuestCard = ({ guest, host, onEdit, onDelete, onUpdateStatus }: GuestCardProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleStatusUpdate = async (status: "confirmed" | "declined" | "pending") => {
    try {
      const { error } = await supabase
        .from('guests')
        .update({ rsvp_status: status })
        .eq('id', guest.id);

      if (error) throw error;

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

  return (
    <>
      <Card className="bg-white/50">
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-3">
            <GuestHeader
              guest={guest}
              onEdit={() => setIsEditDialogOpen(true)}
              onDelete={onDelete}
              onUpdateStatus={handleStatusUpdate}
            />
            <GuestHostInfo host={host} />
            <GuestContactInfo guest={guest} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <GuestEventBadges events={guest.events} />
        </CardContent>
      </Card>

      <GuestEditDialog
        guest={guest}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={async (updatedGuest) => {
          try {
            const { error } = await supabase
              .from('guests')
              .update(updatedGuest)
              .eq('id', guest.id);

            if (error) throw error;

            queryClient.invalidateQueries({ queryKey: ['guests'] });
            setIsEditDialogOpen(false);
            toast({
              title: "Success",
              description: "Guest details updated successfully.",
            });
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to update guest details.",
              variant: "destructive",
            });
          }
        }}
      />
    </>
  );
};
