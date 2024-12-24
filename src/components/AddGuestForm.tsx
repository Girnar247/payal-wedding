import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { UserPlus } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { Select } from "@/components/ui/select";
import { Checkbox } from "./ui/checkbox";
import { EventType, Host } from "@/types/guest";

interface GuestFormData {
  name: string;
  email: string;
  phone: string;
  plusCount: number;
  hostId: string;
  arrivalDateTime?: Date;
  events: EventType[];
}

interface AddGuestFormProps {
  onSubmit: (data: GuestFormData) => void;
  hosts: Host[];
}

export const AddGuestForm = ({ onSubmit, hosts }: AddGuestFormProps) => {
  const [formData, setFormData] = useState<GuestFormData>({
    name: "",
    email: "",
    phone: "",
    plusCount: 0,
    hostId: "",
    events: [],
  });

  const eventTypes: EventType[] = ["haldi", "mehndi", "mayra", "sangeet", "wedding"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: "",
      email: "",
      phone: "",
      plusCount: 0,
      hostId: "",
      events: [],
    });
  };

  return (
    <Card className="glass-card p-6 max-w-md mx-auto fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Guest Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-white/50"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="bg-white/50"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="bg-white/50"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="plusCount">Additional Guests</Label>
          <Input
            id="plusCount"
            type="number"
            min="0"
            max="5"
            value={formData.plusCount}
            onChange={(e) =>
              setFormData({ ...formData, plusCount: parseInt(e.target.value) })
            }
            className="bg-white/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="host">Assigned Host</Label>
          <Select
            value={formData.hostId}
            onValueChange={(value) => setFormData({ ...formData, hostId: value })}
          >
            {hosts.map((host) => (
              <option key={host.id} value={host.id}>
                {host.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Events Attending</Label>
          <div className="space-y-2">
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
        <div className="space-y-2">
          <Label>Arrival Date</Label>
          <Calendar
            mode="single"
            selected={formData.arrivalDateTime}
            onSelect={(date) =>
              setFormData({ ...formData, arrivalDateTime: date || undefined })
            }
            className="rounded-md border"
          />
        </div>
        <Button type="submit" className="w-full">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Guest
        </Button>
      </form>
    </Card>
  );
};