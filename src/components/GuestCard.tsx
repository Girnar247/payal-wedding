import { Guest, Host } from "@/types/guest";
import { Card, CardContent, CardHeader } from "./ui/card";
import { GuestEditDialog } from "./guest-card/GuestEditDialog";
import { useState, memo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GuestHeader } from "./guest-card/GuestHeader";
import { GuestHostInfo } from "./guest-card/GuestHostInfo";
import { GuestEventBadges } from "./guest-card/GuestEventBadges";
import { GuestContactInfo } from "./guest-card/GuestContactInfo";
import { GuestRSVPStatus } from "./guest-card/GuestRSVPStatus";
import { GuestAccommodation } from "./guest-card/GuestAccommodation";

interface GuestCardProps {
  guest: Guest;
  host: Host;
  onEdit?: () => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: "confirmed" | "declined" | "pending") => void;
}

const GuestCardComponent = ({ guest, host, onEdit, onDelete, onUpdateStatus }: GuestCardProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleOpenEditDialog = () => {
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsEditDialogOpen(false);
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

      queryClient.setQueryData(['guests'], (oldData: Guest[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map(g => g.id === guest.id ? { ...g, ...data } : g);
      });

      handleCloseDialog();
      toast({
        title: "Success",
        description: "Guest details updated successfully.",
      });

      await queryClient.invalidateQueries({ queryKey: ['guests'] });
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
          <div className="flex flex-col gap-3">
            <GuestHeader
              guest={guest}
              onEdit={handleOpenEditDialog}
              onDelete={onDelete}
              onUpdateStatus={onUpdateStatus}
            />
            <GuestHostInfo host={host} />
            <GuestContactInfo guest={guest} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <GuestEventBadges events={guest.events} />
          <GuestAccommodation guest={guest} />
        </CardContent>
      </Card>

      <GuestRSVPStatus guest={guest} onUpdateStatus={onUpdateStatus} />

      {isEditDialogOpen && (
        <GuestEditDialog
          guest={guest}
          isOpen={isEditDialogOpen}
          onClose={handleCloseDialog}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export const GuestCard = memo(GuestCardComponent);