import { useState } from "react";
import { User, UserCheck, UserX, Pencil, Trash2, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { EventType, Host } from "@/types/guest";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { supabase } from "@/lib/supabase";
import { useToast } from "./ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface GuestCardProps {
  guest: {
    id: string;
    name: string;
    email?: string;
    phone: string;
    rsvp_status: "pending" | "confirmed" | "declined";
    plus_count: number;
    host_id: string;
    events: EventType[];
    attributes: string[];
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedGuest, setEditedGuest] = useState(guest);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const allEvents: EventType[] = ["haldi", "mehndi", "mayra", "sangeet", "wedding"];

  const handleEditSubmit = async () => {
    try {
      const { error } = await supabase
        .from('guests')
        .update({
          name: editedGuest.name,
          email: editedGuest.email,
          phone: editedGuest.phone,
          plus_count: editedGuest.plus_count,
          events: editedGuest.events,
        })
        .eq('id', guest.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['guests'] });
      queryClient.invalidateQueries({ queryKey: ['eventGuestCounts'] });
      
      toast({
        title: "Guest Updated",
        description: "Guest details have been successfully updated.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update guest details.",
        variant: "destructive",
      });
    }
  };

  const handleAllEventsChange = (checked: boolean) => {
    setEditedGuest(prev => ({
      ...prev,
      events: checked ? allEvents : [],
    }));
  };

  return (
    <>
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
              {guest.plus_count > 0 && (
                <Badge variant="outline" className="bg-wedding-rose/20">
                  +{guest.plus_count}
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
            <div className="flex flex-wrap gap-2 mt-2">
              {guest.attributes.map((attr) => (
                <Badge key={attr} variant="secondary" className="capitalize">
                  {attr}
                </Badge>
              ))}
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-600">Host: {host.name}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
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

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Guest Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editedGuest.name}
                onChange={(e) =>
                  setEditedGuest((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                value={editedGuest.email || ""}
                onChange={(e) =>
                  setEditedGuest((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={editedGuest.phone}
                onChange={(e) =>
                  setEditedGuest((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="plus_count">Additional Guests</Label>
              <Input
                id="plus_count"
                type="number"
                min="0"
                value={editedGuest.plus_count}
                onChange={(e) =>
                  setEditedGuest((prev) => ({
                    ...prev,
                    plus_count: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Events Attending</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="all-events"
                  checked={editedGuest.events.length === allEvents.length}
                  onCheckedChange={handleAllEventsChange}
                />
                <label
                  htmlFor="all-events"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  All Events
                </label>
              </div>
              {allEvents.map((event) => (
                <div key={event} className="flex items-center space-x-2">
                  <Checkbox
                    id={event}
                    checked={editedGuest.events.includes(event)}
                    onCheckedChange={(checked) => {
                      setEditedGuest((prev) => ({
                        ...prev,
                        events: checked
                          ? [...prev.events, event]
                          : prev.events.filter((e) => e !== event),
                      }));
                    }}
                  />
                  <label
                    htmlFor={event}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {event.charAt(0).toUpperCase() + event.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};