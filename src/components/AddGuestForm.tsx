import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { UserPlus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "./ui/checkbox";
import { EventType, GuestAttribute, Host } from "@/types/guest";
import { toast } from "./ui/use-toast";

interface GuestFormData {
  name: string;
  email?: string;
  phone?: string;
  plusCount: number;
  hostId: string;
  events: EventType[];
  attributes: GuestAttribute[];
  side?: "bride" | "groom";
}

interface AddGuestFormProps {
  onSubmit: (data: GuestFormData) => void;
  hosts: Host[];
  side?: "bride" | "groom";
}

export const AddGuestForm = ({ onSubmit, hosts, side }: AddGuestFormProps) => {
  const [formData, setFormData] = useState<GuestFormData>({
    name: "",
    phone: "",
    plusCount: 0,
    hostId: "",
    events: [],
    attributes: [],
    side: side
  });

  const eventTypes: EventType[] = ["haldi", "mehndi", "mayra", "sangeet", "wedding"];
  const guestAttributes: GuestAttribute[] = ["family", "friends", "staff", "mohalla"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.plusCount > 20) {
      toast({
        title: "Error",
        description: "Contact admin to add more than the limit - 20 guests",
        variant: "destructive",
      });
      return;
    }
    onSubmit(formData);
    setFormData({
      name: "",
      phone: "",
      plusCount: 0,
      hostId: "",
      events: [],
      attributes: [],
      side: side
    });
  };

  const handleAllEventsChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      events: checked ? eventTypes : [],
    }));
  };

  const isAllEventsSelected = formData.events.length === eventTypes.length;

  return (
    <Card className="glass-card p-6 max-w-md mx-auto fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Guest Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-white/50"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address (Optional)</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ""}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="bg-white/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number (Optional)</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="bg-white/50"
          />
        </div>
        <div className="space-y-2">
          <Label>Guest Categories *</Label>
          <div className="flex flex-wrap gap-4">
            {guestAttributes.map((attr) => (
              <div key={attr} className="flex items-center space-x-2">
                <Checkbox
                  id={attr}
                  checked={formData.attributes.includes(attr)}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      attributes: checked
                        ? [...formData.attributes, attr]
                        : formData.attributes.filter((a) => a !== attr),
                    })
                  }
                />
                <Label htmlFor={attr} className="capitalize">
                  {attr}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="plusCount">Additional Guests</Label>
          <Input
            id="plusCount"
            type="number"
            min="0"
            max="20"
            value={formData.plusCount}
            onChange={(e) =>
              setFormData({ ...formData, plusCount: parseInt(e.target.value) })
            }
            className="bg-white/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="host">Assigned Host *</Label>
          <Select
            value={formData.hostId}
            onValueChange={(value) => setFormData({ ...formData, hostId: value })}
          >
            <SelectTrigger className="w-full bg-white/50">
              <SelectValue placeholder="Select a host" />
            </SelectTrigger>
            <SelectContent>
              {hosts.map((host) => (
                <SelectItem key={host.id} value={host.id}>
                  {host.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Events Attending *</Label>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="all-events"
                checked={isAllEventsSelected}
                onCheckedChange={handleAllEventsChange}
              />
              <Label htmlFor="all-events">All Events</Label>
            </div>
            {eventTypes.map((event) => (
              <div key={event} className="flex items-center space-x-2">
                <Checkbox
                  id={event}
                  checked={formData.events.includes(event)}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      events: checked
                        ? [...formData.events, event]
                        : formData.events.filter((e) => e !== event),
                    })
                  }
                />
                <Label htmlFor={event} className="capitalize">
                  {event}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <Button type="submit" className="w-full">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Guest
        </Button>
      </form>
    </Card>
  );
};