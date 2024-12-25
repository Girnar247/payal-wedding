import { Guest, Host } from "@/types/guest";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { UserCheck, UserX } from "lucide-react";

interface GuestListProps {
  guests: Guest[];
  hosts: Host[];
  defaultHost: Host;
  onUpdateStatus: (id: string, status: "confirmed" | "declined") => void;
}

export const GuestList = ({ guests, hosts, defaultHost, onUpdateStatus }: GuestListProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Host</TableHead>
            <TableHead>Additional Guests</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map((guest) => {
            const host = hosts.find((h) => h.id === guest.hostId) || defaultHost;
            return (
              <TableRow key={guest.id}>
                <TableCell className="font-medium">{guest.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {guest.attribute}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {guest.email && <div className="text-sm">{guest.email}</div>}
                    <div className="text-sm">{guest.phone}</div>
                  </div>
                </TableCell>
                <TableCell>{host.name}</TableCell>
                <TableCell>{guest.plusCount > 0 ? `+${guest.plusCount}` : "-"}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      guest.rsvpStatus === "confirmed"
                        ? "default"
                        : guest.rsvpStatus === "declined"
                        ? "destructive"
                        : "secondary"
                    }
                    className="capitalize"
                  >
                    {guest.rsvpStatus}
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