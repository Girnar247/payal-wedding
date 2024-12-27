import { Guest, Host } from "@/types/guest";
import { Card, CardContent, CardHeader } from "./ui/card";
import { GuestEditDialog } from "./guest-card/GuestEditDialog";
import { GuestActions } from "./guest-card/GuestActions";
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Badge } from "./ui/badge";
import { MessageSquare, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog } from "./ui/dialog";
import { Checkbox } from "./ui/checkbox";

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

  const handleWhatsappInvitation = async () => {
    if (!guest.phone) {
      toast({
        title: "Error",
        description: "Guest phone number is required to send WhatsApp invitation.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Fetch the default template
      const { data: templates, error } = await supabase
        .from('invitation_templates')
        .select('whatsapp_content')
        .limit(1);

      if (error) throw error;

      const message = encodeURIComponent(templates?.[0]?.whatsapp_content || "You are invited to our wedding celebration!");
      const whatsappUrl = `https://wa.me/${guest.phone}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send WhatsApp message.",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = (status: "confirmed" | "declined" | "pending") => {
    if (status === "confirmed" && guest.plus_count > 0) {
      setShowPlusOneDialog(true);
    } else {
      onUpdateStatus(guest.id, status);
    }
  };

  const statusColors = {
    confirmed: "bg-green-100 text-green-800",
    declined: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
  };

  return (
    <>
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
                onUpdateStatus={handleStatusUpdate}
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
          <div className="flex flex-wrap gap-2">
            {guest.events.map((event) => (
              <Badge key={event} variant="outline" className="capitalize">
                {event}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            {guest.phone && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleWhatsappInvitation}
                className="p-2"
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            )}
            {guest.email && (
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                onClick={() => window.location.href = `mailto:${guest.email}`}
              >
                <Mail className="h-4 w-4" />
              </Button>
            )}
          </div>
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