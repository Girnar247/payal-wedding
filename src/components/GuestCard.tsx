import { useState } from "react";
import { Guest, Host } from "@/types/guest";
import { Card, CardContent, CardHeader } from "./ui/card";
import { GuestHeader } from "./guest-card/GuestHeader";
import { GuestActions } from "./guest-card/GuestActions";
import { GuestBadges } from "./guest-card/GuestBadges";
import { GuestAccommodation } from "./guest-card/GuestAccommodation";
import { GuestInvitations } from "./guest-card/GuestInvitations";
import { GuestEventBadges } from "./guest-card/GuestEventBadges";
import { GuestContactInfo } from "./guest-card/GuestContactInfo";
import { GuestRSVPStatus } from "./guest-card/GuestRSVPStatus";
import { GuestEditDialog } from "./guest-card/GuestEditDialog";
import { useToast } from "./ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface GuestCardProps {
  guest: Guest;
  host: Host;
  onEdit?: () => void;
  onDelete?: (id: string) => void;
  onUpdateStatus?: (id: string, status: "confirmed" | "declined") => void;
}

export const GuestCard = ({ guest, host, onEdit, onDelete, onUpdateStatus }: GuestCardProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = () => {
    if (onDelete) {
      onDelete(guest.id);
    }
  };

  const handleSave = async (updatedGuest: Partial<Guest>) => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .update(updatedGuest)
        .eq('id', guest.id)
        .select()
        .single();

      if (error) throw error;

      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Guest details have been updated.",
      });

      queryClient.invalidateQueries({ queryKey: ['guests'] });
    } catch (error) {
      console.error('Error updating guest:', error);
      toast({
        title: "Error",
        description: "Failed to update guest details.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="bg-white/50">
        <CardHeader className="pb-2">
          <GuestHeader guest={guest} onEdit={() => setIsEditDialogOpen(true)} onDelete={handleDelete} />
          <GuestContactInfo guest={guest} />
          <GuestRSVPStatus status={guest.rsvp_status} onUpdateStatus={onUpdateStatus} guestId={guest.id} />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <GuestBadges 
              rsvpStatus={guest.rsvp_status}
              plusCount={guest.plus_count}
              events={guest.events}
              attributes={guest.attributes}
            />
            <GuestEventBadges events={guest.events} />
            <GuestAccommodation guest={guest} />
            <GuestInvitations guest={guest} host={host} />
          </div>
        </CardContent>
      </Card>

      <GuestEditDialog
        guest={guest}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSave}
      />
    </>
  );
};