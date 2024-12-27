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
import { Button } from "./ui/button";
import { Mail, MessageSquare } from "lucide-react";

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

  const handleSendInvitation = async () => {
    if (!guest.email) {
      toast({
        title: "Error",
        description: "Guest email is required to send invitation.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("send-invitation", {
        body: { guestId: guest.id, hostEmail: host.email },
      });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['guests'] });
      toast({
        title: "Success",
        description: "Wedding invitation has been sent!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation.",
        variant: "destructive",
      });
    }
  };

  const handleWhatsappInvitation = () => {
    if (!guest.phone) {
      toast({
        title: "Error",
        description: "Guest phone number is required to send WhatsApp invitation.",
        variant: "destructive",
      });
      return;
    }

    const message = encodeURIComponent("You are invited, bro");
    const whatsappUrl = `https://wa.me/${guest.phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Card className="bg-white/50">
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg">{guest.name}</h3>
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

        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSendInvitation}
            disabled={!guest.email}
          >
            <Mail className="h-4 w-4 mr-2" />
            {guest.invitation_sent ? "Invitation Sent" : "Send Invitation"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleWhatsappInvitation}
            disabled={!guest.phone}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            WhatsApp
          </Button>
        </div>
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