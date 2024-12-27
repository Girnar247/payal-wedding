import { Guest } from "@/types/guest";
import { Badge } from "@/components/ui/badge";
import { GuestActions } from "./GuestActions";

interface GuestHeaderProps {
  guest: Guest;
  onEdit: () => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: "confirmed" | "declined" | "pending") => void;
}

export const GuestHeader = ({ guest, onEdit, onDelete, onUpdateStatus }: GuestHeaderProps) => {
  const statusColors = {
    confirmed: "bg-green-100 text-green-800",
    declined: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
  };

  return (
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
        onEdit={onEdit}
        onDelete={onDelete}
        onUpdateStatus={onUpdateStatus}
      />
    </div>
  );
};