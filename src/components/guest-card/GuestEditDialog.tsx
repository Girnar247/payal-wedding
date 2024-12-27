import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { EventType, Guest } from "@/types/guest";
import { useState } from "react";

interface GuestEditDialogProps {
  guest: Guest;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedGuest: Partial<Guest>) => void;
}

export const GuestEditDialog = ({ guest, isOpen, onClose, onSave }: GuestEditDialogProps) => {
  const [editedGuest, setEditedGuest] = useState(guest);
  const allEvents: EventType[] = ["haldi", "mehndi", "mayra", "sangeet", "wedding"];

  const handleAllEventsChange = (checked: boolean) => {
    setEditedGuest(prev => ({
      ...prev,
      events: checked ? allEvents : [],
    }));
  };

  const isAllEventsSelected = editedGuest.events.length === allEvents.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
                checked={isAllEventsSelected}
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
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(editedGuest)}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};