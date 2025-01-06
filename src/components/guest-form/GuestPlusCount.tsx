import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface GuestPlusCountProps {
  plusCount: number;
  onPlusCountChange: (count: number) => void;
}

export const GuestPlusCount = ({
  plusCount,
  onPlusCountChange,
}: GuestPlusCountProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="plusCount">Additional Guests</Label>
      <Input
        id="plusCount"
        type="number"
        min="0"
        max="20"
        value={plusCount}
        onChange={(e) => onPlusCountChange(parseInt(e.target.value))}
        className="bg-white/50"
      />
    </div>
  );
};