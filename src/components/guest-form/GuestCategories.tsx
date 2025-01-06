import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { GuestAttribute } from "@/types/guest";

interface GuestCategoriesProps {
  selectedAttributes: GuestAttribute[];
  onAttributeChange: (attributes: GuestAttribute[]) => void;
}

export const GuestCategories = ({
  selectedAttributes,
  onAttributeChange,
}: GuestCategoriesProps) => {
  const guestAttributes: GuestAttribute[] = ["family", "friends", "staff", "mohalla"];

  return (
    <div className="space-y-2">
      <Label>Guest Categories *</Label>
      <div className="flex flex-wrap gap-4">
        {guestAttributes.map((attr) => (
          <div key={attr} className="flex items-center space-x-2">
            <Checkbox
              id={attr}
              checked={selectedAttributes.includes(attr)}
              onCheckedChange={(checked) =>
                onAttributeChange(
                  checked
                    ? [...selectedAttributes, attr]
                    : selectedAttributes.filter((a) => a !== attr)
                )
              }
            />
            <Label htmlFor={attr} className="capitalize">
              {attr}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};