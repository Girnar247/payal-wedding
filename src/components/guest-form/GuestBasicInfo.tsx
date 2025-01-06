import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface GuestBasicInfoProps {
  name: string;
  email?: string;
  phone: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
}

export const GuestBasicInfo = ({
  name,
  email,
  phone,
  onNameChange,
  onEmailChange,
  onPhoneChange,
}: GuestBasicInfoProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Guest Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="bg-white/50"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email Address (Optional)</Label>
        <Input
          id="email"
          type="email"
          value={email || ""}
          onChange={(e) => onEmailChange(e.target.value)}
          className="bg-white/50"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number (Optional)</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          className="bg-white/50"
        />
      </div>
    </>
  );
};