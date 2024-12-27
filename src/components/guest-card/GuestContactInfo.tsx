import { Guest } from "@/types/guest";

interface GuestContactInfoProps {
  guest: Guest;
}

export const GuestContactInfo = ({ guest }: GuestContactInfoProps) => {
  return (
    <div className="space-y-2">
      {guest.email && (
        <p className="text-sm">
          <span className="text-gray-500">Email:</span> {guest.email}
        </p>
      )}
      {guest.phone && (
        <p className="text-sm">
          <span className="text-gray-500">Phone:</span> {guest.phone}
        </p>
      )}
    </div>
  );
};