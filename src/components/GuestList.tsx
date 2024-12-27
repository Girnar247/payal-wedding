import { Guest, Host } from "@/types/guest";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { UserCheck, UserX, Mail, MessageSquare } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

interface GuestListProps {
  guests: Guest[];
  hosts: Host[];
  defaultHost: Host;
  onUpdateStatus: (id: string, status: "confirmed" | "declined") => void;
}

export const GuestList = ({ guests, hosts, defaultHost, onUpdateStatus }: GuestListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSendInvitation = async (guest: Guest, host: Host) => {
    if (!guest.email) {
      toast({
        title: "Error",
        description: "Guest email is required to send invitation.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("send-invitation", {
        body: { guestId: guest.id, hostEmail: host.email },
      });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['guests'] });
      toast({
        title: "Success",
        description: "Wedding invitation has been sent!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation.",
        variant: "destructive",
      });
    }
  };

  const handleWhatsappInvitation = (guest: Guest) => {
    if (!guest.phone) {
      toast({
        title: "Error",
        description: "Guest phone number is required to send WhatsApp invitation.",
        variant: "destructive",
      });
      return;
    }

    const message = encodeURIComponent("You are invited, bro");
    const whatsappUrl = `https://wa.me/${guest.phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Categories</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Host</TableHead>
            <TableHead>Additional Guests</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map((guest) => {
            const host = hosts.find((h) => h.id === guest.host_id) || defaultHost;
            return (
              <TableRow key={guest.id}>
                <TableCell className="font-medium">{guest.name}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {guest.attributes.map((attr) => (
                      <Badge key={attr} variant="outline" className="capitalize">
                        {attr}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {guest.email && <div className="text-sm">{guest.email}</div>}
                    {guest.phone && <div className="text-sm">{guest.phone}</div>}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={host.avatar_url} alt={host.name} />
                      <AvatarFallback>{host.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {host.name}
                  </div>
                </TableCell>
                <TableCell>{guest.plus_count > 0 ? `+${guest.plus_count}` : "-"}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      guest.rsvp_status === "confirmed"
                        ? "default"
                        : guest.rsvp_status === "declined"
                        ? "destructive"
                        : "secondary"
                    }
                    className="capitalize"
                  >
                    {guest.rsvp_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onUpdateStatus(guest.id, "confirmed")}
                    >
                      <UserCheck className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onUpdateStatus(guest.id, "declined")}
                    >
                      <UserX className="h-4 w-4 text-red-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSendInvitation(guest, host)}
                      disabled={!guest.email}
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleWhatsappInvitation(guest)}
                      disabled={!guest.phone}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};