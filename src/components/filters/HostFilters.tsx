import { Host } from "@/types/guest";
import { Badge } from "@/components/ui/badge";

interface HostFiltersProps {
  hosts: Host[];
  selectedHost: string;
  onHostSelect: (hostId: string) => void;
}

export const HostFilters = ({ hosts, selectedHost, onHostSelect }: HostFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {hosts.map((host) => (
        <Badge
          key={host.id}
          variant={selectedHost === host.id ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => onHostSelect(selectedHost === host.id ? "" : host.id)}
        >
          {host.name}
        </Badge>
      ))}
    </div>
  );
};