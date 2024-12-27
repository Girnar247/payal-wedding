import { Guest, Host, EventType } from "@/types/guest";
import { Card, CardContent, CardHeader } from "./ui/card";
import { GuestBadges } from "./guest-card/GuestBadges";
import { GuestEditDialog } from "./guest-card/GuestEditDialog";
import { GuestActions } from "./guest-card/GuestActions";
import { useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "./ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

interface GuestCardProps {
  guest: Guest;
  host: Host;
  onEdit?: () => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: "confirmed" | "declined") => void;
}

export const GuestCard = ({ guest, host, onEdit, onDelete, onUpdateStatus }: GuestCardProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleAccommodationChange = async (checked: boolean) => {
    try {
      const { error } = await supabase
        .from('guests')
        .update({ accommodation_required: checked })
        .eq('id', guest.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['guests'] });
      toast({
        title: "Updated",
        description: `Accommodation requirement ${checked ? 'added' : 'removed'}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update accommodation requirement.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-white/50">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border border-gray-200">
              <AvatarImage src={host.avatar_url} alt={host.name} />
              <AvatarFallback>{host.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{guest.name}</h3>
              <p className="text-sm text-gray-500">Host: {host.name}</p>
            </div>
          </div>
          <GuestActions
            guest={guest}
            onEdit={() => setIsEditDialogOpen(true)}
            onDelete={onDelete}
            onUpdateStatus={onUpdateStatus}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {guest.email && (
            <p className="text-sm">
              <span className="text-gray-500">Email:</span> {guest.email}
            </p>
          )}
          {guest.phone && (
            <p className="text-sm">
              <span className="text-gray-500">Phone:</span> {guest.phone}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id={`accommodation-${guest.id}`}
            checked={guest.accommodation_required}
            onCheckedChange={handleAccommodationChange}
          />
          <label
            htmlFor={`accommodation-${guest.id}`}
            className="text-sm text-gray-700"
          >
            Accommodation Required
          </label>
        </div>

        <GuestBadges
          rsvpStatus={guest.rsvp_status}
          plusCount={guest.plus_count}
          events={guest.events as EventType[]}
          attributes={guest.attributes}
        />
      </CardContent>

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
    </Card>
  );
};