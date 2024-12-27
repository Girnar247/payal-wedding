import { Button } from "@/components/ui/button";
import { UserCheck, UserX } from "lucide-react";

interface GuestActionsProps {
  onConfirm: () => void;
  onDecline: () => void;
  isHovered: boolean;
}

export const GuestActions = ({ onConfirm, onDecline, isHovered }: GuestActionsProps) => {
  return (
    <div
      className={`absolute bottom-0 left-0 right-0 bg-wedding-rose/10 backdrop-blur-sm p-3 flex justify-center gap-4 transition-all duration-300 ${
        isHovered ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={onConfirm}
        className="hover:bg-green-100"
      >
        <UserCheck className="h-4 w-4 text-green-600 mr-2" />
        Confirm
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDecline}
        className="hover:bg-red-100"
      >
        <UserX className="h-4 w-4 text-red-500 mr-2" />
        Decline
      </Button>
    </div>
  );
};