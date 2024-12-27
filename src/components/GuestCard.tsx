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
import { GuestRSVPStatus } from "./guest-card/GuestRSVPStatus";
import { Skeleton } from "./ui/skeleton";

interface GuestCardProps {
  guest: Guest;
  host: Host;
  onEdit?: () => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: "confirmed" | "declined" | "pending") => void;
}

export const GuestCard = ({ guest, host, onEdit, onDelete, onUpdateStatus }: GuestCardProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
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
      setIsUpdating(true);
      
      // First, make the Supabase update request
      const { data, error } = await supabase
        .from('guests')
        .update(updatedGuest)
        .eq('id', guest.id)
        .select()
        .single();

      if (error) throw error;

      // After successful update, update the cache with the complete returned data
      queryClient.setQueryData(['guests'], (oldData: Guest[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map(g => g.id === guest.id ? { ...g, ...data } : g);
      });

      // Close dialog and show success message
      handleCloseDialog();
      toast({
        title: "Success",
        description: "Guest details updated successfully.",
      });

      // Finally, invalidate the query to ensure data consistency
      await queryClient.invalidateQueries({ queryKey: ['guests'] });
      
      // Add a small delay before removing loading state to ensure smooth transition
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