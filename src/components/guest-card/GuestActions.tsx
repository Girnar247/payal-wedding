import { Guest } from "@/types/guest";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash, Check, X, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface GuestActionsProps {
  guest: Guest;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: "confirmed" | "declined" | "pending") => void;
}

export const GuestActions = ({ guest, onDelete, onUpdateStatus }: GuestActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onUpdateStatus(guest.id, "confirmed")}>
          <Check className="mr-2 h-4 w-4 text-green-600" />
          Mark as Confirmed
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onUpdateStatus(guest.id, "declined")}>
          <X className="mr-2 h-4 w-4 text-red-600" />
          Mark as Declined
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onUpdateStatus(guest.id, "pending")}>
          <Clock className="mr-2 h-4 w-4 text-yellow-600" />
          Mark as Pending
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(guest.id)} className="text-red-600">
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};