import { MoreHorizontal, Trash2, UserCheck, UserX, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Guest } from "@/types/guest";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface GuestActionsProps {
  guest: Guest;
  onEdit: () => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: "confirmed" | "declined") => void;
}

export const GuestActions = ({
  guest,
  onEdit,
  onDelete,
  onUpdateStatus,
}: GuestActionsProps) => {
  const handleEmailGuestList = async () => {
    try {
      const { error } = await supabase.functions.invoke('email-guest-list', {
        body: { hostId: guest.host_id }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Guest list has been emailed to the host.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to email guest list. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onUpdateStatus(guest.id, "confirmed")}>
          <UserCheck className="mr-2 h-4 w-4 text-green-600" />
          Confirm
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onUpdateStatus(guest.id, "declined")}>
          <UserX className="mr-2 h-4 w-4 text-red-500" />
          Decline
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(guest.id)}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEmailGuestList}>
          <Mail className="mr-2 h-4 w-4" />
          Email Guest List
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};