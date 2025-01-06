import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "../ui/label";
import { Host } from "@/types/guest";

interface GuestHostSelectProps {
  hostId: string;
  hosts: Host[];
  onHostChange: (hostId: string) => void;
}

export const GuestHostSelect = ({
  hostId,
  hosts,
  onHostChange,
}: GuestHostSelectProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="host">Assigned Host *</Label>
      <Select value={hostId} onValueChange={onHostChange}>
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
  );
};