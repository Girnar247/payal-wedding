import { useState } from "react";
import { User, UserCheck, UserX, Pencil, Trash2, Phone, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { EventType, Host } from "@/types/guest";

interface GuestCardProps {
  guest: {
    id: string;
    name: string;
    email?: string; // Made optional to match Guest type
    phone: string;
    rsvpStatus: "pending" | "confirmed" | "declined";
    plusCount: number;
    hostId: string;
    arrivalDateTime?: Date;
    events: EventType[];
  };
  host: Host;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: "confirmed" | "declined") => void;
}

export const GuestCard = ({
  guest,
  host,
  onEdit,
  onDelete,
  onUpdateStatus,
}: GuestCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="glass-card p-6 transition-all duration-300 hover:shadow-xl relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h3 className="text-xl font-playfair">{guest.name}</h3>
          {guest.email && <p className="text-sm text-gray-600">{guest.email}</p>}
          <p className="text-sm text-gray-600 flex items-center">
            <Phone className="h-4 w-4 mr-2" />
            {guest.phone}
          </p>
          <div className="flex gap-2 mt-2">
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
            {guest.plusCount > 0 && (
              <Badge variant="outline" className="bg-wedding-rose/20">
                +{guest.plusCount}
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {guest.events.map((event) => (
              <Badge key={event} variant="outline" className="capitalize">
                {event}
              </Badge>
            ))}
          </div>
          {guest.arrivalDateTime && (
            <p className="text-sm text-gray-600 flex items-center mt-2">
              <Calendar className="h-4 w-4 mr-2" />
              Arriving: {guest.arrivalDateTime.toLocaleDateString()}
            </p>
          )}
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              Host: {host.name}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(guest.id)}
            className="transition-all duration-300 hover:bg-wedding-rose/20"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(guest.id)}
            className="transition-all duration-300 hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
      <div
        className={`absolute bottom-0 left-0 right-0 bg-wedding-rose/10 backdrop-blur-sm p-3 flex justify-center gap-4 transition-all duration-300 ${
          isHovered ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onUpdateStatus(guest.id, "confirmed")}
          className="hover:bg-green-100"
        >
          <UserCheck className="h-4 w-4 text-green-600 mr-2" />
          Confirm
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onUpdateStatus(guest.id, "declined")}
          className="hover:bg-red-100"
        >
          <UserX className="h-4 w-4 text-red-500 mr-2" />
          Decline
        </Button>
      </div>
    </Card>
  );
};