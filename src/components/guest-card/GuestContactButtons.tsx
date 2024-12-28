import { Guest } from "@/types/guest";
import { Button } from "@/components/ui/button";
import { MessageSquare, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface GuestContactButtonsProps {
  guest: Guest;
}

export const GuestContactButtons = ({ guest }: GuestContactButtonsProps) => {
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
      const { data: templates } = await supabase
        .from('invitation_templates')
        .select('whatsapp_content')
        .limit(1);

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

  return (
    <div className="flex flex-wrap gap-2">
      {guest.phone && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleWhatsappInvitation}
          className="p-2 h-8 w-8"
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      )}
      {guest.email && (
        <Button
          variant="ghost"
          size="sm"
          className="p-2 h-8 w-8"
          onClick={() => window.location.href = `mailto:${guest.email}`}
        >
          <Mail className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};