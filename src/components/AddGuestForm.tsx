import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { UserPlus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GuestFormData {
  name: string;
  email: string;
  phone: string;
  plusGuests: number;
  events: string[];
}

interface AddGuestFormProps {
  onSubmit: (data: GuestFormData) => void;
}

export const AddGuestForm = ({ onSubmit }: AddGuestFormProps) => {
  const [formData, setFormData] = useState<GuestFormData>({
    name: "",
    email: "",
    phone: "",
    plusGuests: 0,
    events: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: "", email: "", phone: "", plusGuests: 0, events: [] });
  };

  const events = ["Haldi", "Mehndi", "Mayra Sangeet", "Wedding"];

  const handleEventChange = (event: string) => {
    setFormData((prev) => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter((e) => e !== event)
        : [...prev.events, event],
    }));
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
          <Label htmlFor="plusGuests">Additional Guests</Label>
          <Select
            value={formData.plusGuests.toString()}
            onValueChange={(value) =>
              setFormData({ ...formData, plusGuests: parseInt(value) })
            }
          >
            <SelectTrigger className="bg-white/50">
              <SelectValue placeholder="Select number of additional guests" />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2, 3, 4, 5].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num === 0 ? "No additional guests" : `+${num} guests`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Events Attending</Label>
          <div className="grid grid-cols-2 gap-2">
            {events.map((event) => (
              <Button
                key={event}
                type="button"
                variant={formData.events.includes(event) ? "default" : "outline"}
                className="w-full"
                onClick={() => handleEventChange(event)}
              >
                {event}
              </Button>
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