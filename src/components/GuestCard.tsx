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
import { Skeleton } from "./ui/skeleton";

interface GuestCardProps {
  guest: Guest;
  host: Host;
  onEdit?: () => void;
  onDelete?: (id: string) => void;
  onUpdateStatus?: (id: string, status: "confirmed" | "declined") => void;
}

export const GuestCard = ({ guest, host, onEdit, onDelete, onUpdateStatus }: GuestCardProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = () => {
    if (onDelete) {
      onDelete(guest.id);
    }
  };

  const handleSave = async (updatedGuest: Partial<Guest>) => {
    try {
      setIsUpdating(true);
      
      const { data, error } = await supabase
        .from('guests')
        .update(updatedGuest)
        .eq('id', guest.id)
        .select()
        .single();

      if (error) throw error;

      // Close the dialog first
      setIsEditDialogOpen(false);

      // Show success toast
      toast({
        title: "Success",
        description: "Guest details have been updated.",
      });

      // Force a full refetch of the guests query
      await queryClient.invalidateQueries({ queryKey: ['guests'] });
      await queryClient.refetchQueries({ queryKey: ['guests'] });

      // Add a small delay before removing loading state
      setTimeout(() => {
        setIsUpdating(false);
      }, 1000);
    } catch (error) {
      console.error('Error updating guest:', error);
      toast({
        title: "Error",
        description: "Failed to update guest details.",
        variant: "destructive",
      });
      setIsUpdating(false);
    }
  };

  if (isUpdating) {
    return (
      <Card className="bg-white/50">
        <CardHeader className="pb-2">
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

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
            <GuestBadges guest={guest} />
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