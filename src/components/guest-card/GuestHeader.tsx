import { Guest } from "@/types/guest";
import { Badge } from "@/components/ui/badge";
import { GuestActions } from "./GuestActions";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface GuestHeaderProps {
  guest: Guest;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: "confirmed" | "declined" | "pending") => void;
}

export const GuestHeader = ({ guest, onDelete, onUpdateStatus }: GuestHeaderProps) => {
  const statusColors = {
    confirmed: "bg-green-100 text-green-800",
    declined: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg">{guest.name}</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="capitalize">
              {guest.attributes[0] || "Unassigned"}
            </Badge>
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
        </div>
        <GuestActions
          guest={guest}
          onDelete={onDelete}
          onUpdateStatus={onUpdateStatus}
        />
      </div>
      
      {guest.rsvp_status === 'pending' && (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="bg-green-50 hover:bg-green-100"
            onClick={() => onUpdateStatus(guest.id, "confirmed")}
          >
            <Check className="w-4 h-4 mr-1" /> 
            Confirm
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-red-50 hover:bg-red-100"
            onClick={() => onUpdateStatus(guest.id, "declined")}
          >
            <X className="w-4 h-4 mr-1" /> 
            Decline
          </Button>
        </div>
      )}
    </div>
  );
};