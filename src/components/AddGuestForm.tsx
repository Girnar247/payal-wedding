import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { UserPlus } from "lucide-react";

interface GuestFormData {
  name: string;
  email: string;
  plusOne: boolean;
  dietaryRestrictions?: string;
}

interface AddGuestFormProps {
  onSubmit: (data: GuestFormData) => void;
}

export const AddGuestForm = ({ onSubmit }: AddGuestFormProps) => {
  const [formData, setFormData] = useState<GuestFormData>({
    name: "",
    email: "",
    plusOne: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: "", email: "", plusOne: false });
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
        <div className="flex items-center space-x-2">
          <Checkbox
            id="plusOne"
            checked={formData.plusOne}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, plusOne: checked as boolean })
            }
          />
          <Label htmlFor="plusOne">Allow Plus One</Label>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dietary">Dietary Restrictions</Label>
          <Textarea
            id="dietary"
            value={formData.dietaryRestrictions}
            onChange={(e) =>
              setFormData({ ...formData, dietaryRestrictions: e.target.value })
            }
            className="bg-white/50"
            placeholder="Any dietary requirements..."
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