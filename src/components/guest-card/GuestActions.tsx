import { MoreHorizontal, UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Guest } from "@/types/guest";

interface GuestActionsProps {
  guest: Guest;
  onEdit: () => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: "confirmed" | "declined" | "pending") => void;
}

export const GuestActions = ({
  guest,
  onEdit,
  onDelete,
  onUpdateStatus,
}: GuestActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        <DropdownMenuItem onClick={() => onUpdateStatus(guest.id, "confirmed")}>
          <UserCheck className="mr-2 h-4 w-4 text-green-600" />
          Confirm
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onUpdateStatus(guest.id, "declined")}>
          <UserX className="mr-2 h-4 w-4 text-red-500" />
          Decline
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onUpdateStatus(guest.id, "pending")}>
          <UserX className="mr-2 h-4 w-4 text-yellow-500" />
          Mark as Pending
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(guest.id)}
          className="text-red-600"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};