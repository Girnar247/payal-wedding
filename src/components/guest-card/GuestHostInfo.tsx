import { Host } from "@/types/guest";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface GuestHostInfoProps {
  host: Host;
}

export const GuestHostInfo = ({ host }: GuestHostInfoProps) => {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8 border border-gray-200">
        <AvatarImage src={host.avatar_url} alt={host.name} />
        <AvatarFallback>{host.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm text-gray-500">Host: {host.name}</p>
      </div>
    </div>
  );
};