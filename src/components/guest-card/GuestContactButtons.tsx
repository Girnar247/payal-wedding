import { Guest } from "@/types/guest";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface GuestContactButtonsProps {
  guest: Guest;
}

export const GuestContactButtons = ({ guest }: GuestContactButtonsProps) => {
  return (
    <div className="flex gap-2">
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
  );
};