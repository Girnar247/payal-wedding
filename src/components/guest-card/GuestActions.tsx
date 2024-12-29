import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface GuestActionsProps {
  onConfirm: () => void;
  onDecline: () => void;
  status: string;
}

export const GuestActions = ({ onConfirm, onDecline, status }: GuestActionsProps) => {
  return (
    <div className="flex gap-2 mt-4">
      <Button
        onClick={onConfirm}
        variant={status === "confirmed" ? "default" : "outline"}
        size="sm"
        className="flex-1 h-8 px-2 md:px-4"
      >
        <Check className="h-4 w-4 md:mr-2" />
        <span className="hidden md:inline">Confirm</span>
      </Button>
      <Button
        onClick={onDecline}
        variant={status === "declined" ? "destructive" : "outline"}
        size="sm"
        className="flex-1 h-8 px-2 md:px-4"
      >
        <X className="h-4 w-4 md:mr-2" />
        <span className="hidden md:inline">Decline</span>
      </Button>
    </div>
  );
};