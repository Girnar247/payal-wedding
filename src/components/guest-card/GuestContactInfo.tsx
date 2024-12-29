import { Guest } from "@/types/guest";
import { Phone, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface GuestContactInfoProps {
  guest: Guest;
}

export const GuestContactInfo = ({ guest }: GuestContactInfoProps) => {
  const { toast } = useToast();
  
  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleWhatsApp = (phoneNumber: string) => {
    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Phone number is required to send WhatsApp message",
        variant: "destructive",
      });
      return;
    }
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-2">
      {guest.phone && (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-500" />
          <span className="text-sm">{guest.phone}</span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 hover:bg-green-50"
              onClick={() => handleCall(guest.phone!)}
            >
              Call
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-green-50"
              onClick={() => handleWhatsApp(guest.phone!)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      {guest.email && (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-500" />
          <span className="text-sm">{guest.email}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 hover:bg-blue-50"
            onClick={() => handleEmail(guest.email!)}
          >
            Email
          </Button>
        </div>
      )}
    </div>
  );
};