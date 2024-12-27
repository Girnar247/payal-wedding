import { Guest } from "@/types/guest";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GuestContactInfoProps {
  guest: Guest;
}

export const GuestContactInfo = ({ guest }: GuestContactInfoProps) => {
  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div className="space-y-2">
      {guest.email && (
        <p className="text-sm">
          <span className="text-gray-500">Email:</span> {guest.email}
        </p>
      )}
      {guest.phone && (
        <div className="flex items-center gap-2">
          <p className="text-sm">
            <span className="text-gray-500">Phone:</span> {guest.phone}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 hover:bg-green-50"
            onClick={() => handleCall(guest.phone!)}
          >
            <Phone className="h-4 w-4 text-green-600" />
          </Button>
        </div>
      )}
    </div>
  );
};