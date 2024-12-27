import { Guest, Host } from "@/types/guest";
import { Card, CardContent, CardHeader } from "./ui/card";
import { GuestEditDialog } from "./guest-card/GuestEditDialog";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Dialog } from "./ui/dialog";
import { Button } from "./ui/button";
import { GuestHeader } from "./guest-card/GuestHeader";
import { GuestHostInfo } from "./guest-card/GuestHostInfo";
import { GuestEventBadges } from "./guest-card/GuestEventBadges";
import { GuestContactButtons } from "./guest-card/GuestContactButtons";

interface GuestCardProps {
  guest: Guest;
  host: Host;
  onEdit?: () => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: "confirmed" | "declined" | "pending") => void;
}

export const GuestCard = ({ guest, host, onEdit, onDelete, onUpdateStatus }: GuestCardProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showPlusOneDialog, setShowPlusOneDialog] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleStatusUpdate = (status: "confirmed" | "declined" | "pending") => {
    if (status === "confirmed" && guest.plus_count > 0) {
      setShowPlusOneDialog(true);
    } else {
      onUpdateStatus(guest.id, status);
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
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <GuestEventBadges events={guest.events} />
          <GuestContactButtons guest={guest} />
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

      <Dialog open={showPlusOneDialog} onOpenChange={setShowPlusOneDialog}>
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-semibold">Additional Guests</h3>
            <p>Are the additional {guest.plus_count} guests also confirmed?</p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPlusOneDialog(false);
                  onUpdateStatus(guest.id, "confirmed");
                }}
              >
                Yes
              </Button>
              <Button
                onClick={() => {
                  setShowPlusOneDialog(false);
                  toast({
                    title: "Action Required",
                    description: "Please update the guest count in edit mode.",
                  });
                }}
              >
                No
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};