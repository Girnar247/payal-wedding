import { Guest, Host } from "@/types/guest";
import { Card, CardContent, CardHeader } from "./ui/card";
import { GuestEditDialog } from "./guest-card/GuestEditDialog";
import { GuestActions } from "./guest-card/GuestActions";
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/lib/supabase";
import { GuestContactInfo } from "./guest-card/GuestContactInfo";
import { GuestInvitations } from "./guest-card/GuestInvitations";
import { Badge } from "./ui/badge";
import { UserCheck, UserX } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";

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
        .update({ 
          accommodation_required: checked,
          accommodation_count: checked ? (guest.plus_count + 1) : 0
        })
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
              {guest.plus_count > 0 && (
                <Badge variant="outline" className="bg-wedding-rose/20">
                  +{guest.plus_count}
                </Badge>
              )}
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
        <GuestContactInfo guest={guest} />
        <div className="flex flex-wrap gap-2">
          {guest.events.map((event) => (
            <Badge key={event} variant="outline" className="capitalize">
              {event}
            </Badge>
          ))}
          {guest.attributes.map((attr) => (
            <Badge key={attr} variant="secondary" className="capitalize">
              {attr}
            </Badge>
          ))}
        </div>
        <GuestInvitations guest={guest} host={host} />
        {guest.rsvp_status === "pending" && (
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full hover:bg-green-50 border-green-600 text-green-600"
              onClick={() => onUpdateStatus(guest.id, "confirmed")}
            >
              <UserCheck className="h-4 w-4 text-green-600 mr-2" />
              Confirm
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full hover:bg-red-50 border-red-500 text-red-500"
              onClick={() => onUpdateStatus(guest.id, "declined")}
            >
              <UserX className="h-4 w-4 text-red-500 mr-2" />
              Decline
            </Button>
          </div>
        )}
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