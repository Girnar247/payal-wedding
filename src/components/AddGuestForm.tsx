import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { UserPlus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventType, GuestAttribute, Host } from "@/types/guest";
import { toast } from "./ui/use-toast";
import { GuestBasicInfo } from "./guest-form/GuestBasicInfo";
import { GuestCategories } from "./guest-form/GuestCategories";
import { GuestEvents } from "./guest-form/GuestEvents";

interface GuestFormData {
  name: string;
  email?: string;
  phone: string;
  plusCount: number;
  hostId: string;
  events: EventType[];
  attributes: GuestAttribute[];
  side: "bride" | "groom";
}

interface AddGuestFormProps {
  onSubmit: (data: GuestFormData) => void;
  hosts: Host[];
  side: "bride" | "groom";
}

export const AddGuestForm = ({ onSubmit, hosts, side }: AddGuestFormProps) => {
  const [formData, setFormData] = useState<GuestFormData>({
    name: "",
    email: "",
    phone: "",
    plusCount: 0,
    hostId: "",
    events: [],
    attributes: [],
    side
  });

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
    
    onSubmit({
      ...formData,
      side // Always use the current side prop
    });
    
    setFormData({
      name: "",
      email: "",
      phone: "",
      plusCount: 0,
      hostId: "",
      events: [],
      attributes: [],
      side // Reset with the current side
    });
  };

  return (
    <Card className="glass-card p-6 max-w-md mx-auto fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <GuestBasicInfo
          name={formData.name}
          email={formData.email}
          phone={formData.phone}
          onNameChange={(value) => setFormData({ ...formData, name: value })}
          onEmailChange={(value) => setFormData({ ...formData, email: value })}
          onPhoneChange={(value) => setFormData({ ...formData, phone: value })}
        />

        <GuestCategories
          selectedAttributes={formData.attributes}
          onAttributeChange={(attributes) => setFormData({ ...formData, attributes })}
        />

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

        <GuestEvents
          selectedEvents={formData.events}
          onEventsChange={(events) => setFormData({ ...formData, events })}
        />

        <Button type="submit" className="w-full">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Guest
        </Button>
      </form>
    </Card>
  );
};