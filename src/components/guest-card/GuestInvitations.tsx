import { Guest, Host } from "@/types/guest";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface GuestInvitationsProps {
  guest: Guest;
  host: Host;
}

export const GuestInvitations = ({ guest, host }: GuestInvitationsProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

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

    const message = encodeURIComponent("You are invited to our wedding celebration!");
    const whatsappUrl = `https://wa.me/${guest.phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="flex gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={handleSendInvitation}
        disabled={!guest.email}
        className="flex items-center gap-2"
      >
        <Mail className="h-4 w-4" />
        {guest.invitation_sent ? "Invitation Sent" : "Send Invitation"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleWhatsappInvitation}
        disabled={!guest.phone}
        className="flex items-center gap-2"
      >
        <MessageSquare className="h-4 w-4" />
        WhatsApp
      </Button>
    </div>
  );
};