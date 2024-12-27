import { useState } from "react";
import { Pencil, Trash2, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Host, EventType, GuestAttribute } from "@/types/guest";
import { supabase } from "@/lib/supabase";
import { useToast } from "./ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { GuestBadges } from "./guest-card/GuestBadges";
import { GuestEditDialog } from "./guest-card/GuestEditDialog";
import { GuestActions } from "./guest-card/GuestActions";

interface GuestCardProps {
  guest: {
    id: string;
    name: string;
    email?: string;
    phone: string;
    rsvp_status: "pending" | "confirmed" | "declined";
    plus_count: number;
    host_id: string;
    events: string[];
    attributes: string[];
  };
  host: Host;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: "confirmed" | "declined") => void;
}

export const GuestCard = ({
  guest,
  host,
  onEdit,
  onDelete,
  onUpdateStatus,
}: GuestCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Cast the string arrays to their proper types
  const typedGuest = {
    ...guest,
    events: guest.events as EventType[],
    attributes: guest.attributes as GuestAttribute[],
  };

  const handleEditSubmit = async (updatedGuest: Partial<typeof typedGuest>) => {
    try {
      const { error } = await supabase
        .from('guests')
        .update({
          name: updatedGuest.name,
          email: updatedGuest.email,
          phone: updatedGuest.phone,
          plus_count: updatedGuest.plus_count,
          events: updatedGuest.events,
        })
        .eq('id', guest.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['guests'] });
      queryClient.invalidateQueries({ queryKey: ['eventGuestCounts'] });
      
      toast({
        title: "Guest Updated",
        description: "Guest details have been successfully updated.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update guest details.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card
        className="glass-card p-6 transition-all duration-300 hover:shadow-xl relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h3 className="text-xl font-playfair">{guest.name}</h3>
            {guest.email && <p className="text-sm text-gray-600">{guest.email}</p>}
            <p className="text-sm text-gray-600 flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              {guest.phone}
            </p>
            <GuestBadges
              rsvpStatus={guest.rsvp_status}
              plusCount={guest.plus_count}
              events={typedGuest.events}
              attributes={typedGuest.attributes}
            />
            <div className="mt-2">
              <p className="text-sm text-gray-600">Host: {host.name}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="transition-all duration-300 hover:bg-wedding-rose/20"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(guest.id)}
              className="transition-all duration-300 hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
        <GuestActions
          isHovered={isHovered}
          onConfirm={() => onUpdateStatus(guest.id, "confirmed")}
          onDecline={() => onUpdateStatus(guest.id, "declined")}
        />
      </Card>

      <GuestEditDialog
        guest={typedGuest}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={handleEditSubmit}
      />
    </>
  );
};