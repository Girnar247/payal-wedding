import { Guest } from "@/types/guest";
import { Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GuestContactInfoProps {
  guest: Guest;
}

export const GuestContactInfo = ({ guest }: GuestContactInfoProps) => {
  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="space-y-2">
      {guest.phone && (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-500" />
          <span className="text-sm">{guest.phone}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 hover:bg-green-50"
            onClick={() => handleCall(guest.phone!)}
          >
            Call
          </Button>
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