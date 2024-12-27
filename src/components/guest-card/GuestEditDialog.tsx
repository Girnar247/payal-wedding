import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { EventType, Guest, GuestAttribute } from "@/types/guest";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface GuestEditDialogProps {
  guest: Guest;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedGuest: Partial<Guest>) => void;
}

export const GuestEditDialog = ({ guest, isOpen, onClose, onSave }: GuestEditDialogProps) => {
  const [editedGuest, setEditedGuest] = useState<Guest>(guest);
  const { toast } = useToast();
  const allEvents: EventType[] = ["haldi", "mehndi", "mayra", "sangeet", "wedding"];
  const allAttributes: GuestAttribute[] = ["family", "friends", "staff", "mohalla"];

  useEffect(() => {
    if (isOpen) {
      setEditedGuest({ ...guest });
    }
  }, [guest, isOpen]);

  const handleAllEventsChange = (checked: boolean) => {
    setEditedGuest(prev => ({
      ...prev,
      events: checked ? allEvents : [],
    }));
  };

  const handlePlusCountChange = (value: string) => {
    const count = parseInt(value) || 0;
    if (count > 20) {
      toast({
        title: "Error",
        description: "Contact admin to add more than the limit - 20 guests",
        variant: "destructive",
      });
      return;
    }
    setEditedGuest(prev => ({ ...prev, plus_count: count }));
  };

  const handleDialogClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    const updatedGuest = {
      name: editedGuest.name,
      email: editedGuest.email,
      phone: editedGuest.phone,
      plus_count: editedGuest.plus_count,
      events: editedGuest.events,
      attributes: editedGuest.attributes,
    };
    onSave(updatedGuest);
  };

  const isAllEventsSelected = editedGuest.events.length === allEvents.length;

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
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
            <Label htmlFor="plus_count">Additional Guests (Max: 20)</Label>
            <Input
              id="plus_count"
              type="number"
              min="0"
              max="20"
              value={editedGuest.plus_count}
              onChange={(e) => handlePlusCountChange(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Events Attending</Label>
            <div className="flex flex-wrap gap-2">
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
          <div className="grid gap-2">
            <Label>Guest Categories</Label>
            <div className="flex flex-wrap gap-2">
              {allAttributes.map((attr) => (
                <div key={attr} className="flex items-center space-x-2">
                  <Checkbox
                    id={attr}
                    checked={editedGuest.attributes.includes(attr)}
                    onCheckedChange={(checked) => {
                      setEditedGuest((prev) => ({
                        ...prev,
                        attributes: checked
                          ? [...prev.attributes, attr]
                          : prev.attributes.filter((a) => a !== attr),
                      }));
                    }}
                  />
                  <label
                    htmlFor={attr}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {attr.charAt(0).toUpperCase() + attr.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};