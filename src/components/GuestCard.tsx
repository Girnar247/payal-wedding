import { Guest, Host } from "@/types/guest";
import { Card, CardContent, CardHeader } from "./ui/card";
import { GuestBadges } from "./guest-card/GuestBadges";
import { GuestEditDialog } from "./guest-card/GuestEditDialog";
import { GuestActions } from "./guest-card/GuestActions";
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/lib/supabase";
import { GuestContactInfo } from "./guest-card/GuestContactInfo";
import { GuestAccommodation } from "./guest-card/GuestAccommodation";
import { GuestInvitations } from "./guest-card/GuestInvitations";
import { Badge } from "./ui/badge";

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

  const statusColors = {
    confirmed: "bg-green-100 text-green-800",
    declined: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
  };

  return (
    <Card className="bg-white/50">
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{guest.name}</h3>
              <Badge 
                variant="secondary"
                className={`capitalize ${statusColors[guest.rsvp_status]}`}
              >
                {guest.rsvp_status}
              </Badge>
            </div>
            <GuestActions
              guest={guest}
              onEdit={() => setIsEditDialogOpen(true)}
              onDelete={onDelete}
              onUpdateStatus={onUpdateStatus}
            />
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border border-gray-200">
              <AvatarImage src={host.avatar_url} alt={host.name} />
              <AvatarFallback>{host.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-gray-500">Host: {host.name}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <GuestContactInfo guest={guest} />
          <GuestAccommodation guest={guest} />
        </div>
        <GuestBadges
          rsvpStatus={guest.rsvp_status}
          plusCount={guest.plus_count}
          events={guest.events}
          attributes={guest.attributes}
        />
        <GuestInvitations guest={guest} host={host} />
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