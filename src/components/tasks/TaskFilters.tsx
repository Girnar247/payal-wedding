import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Host } from "@/types/guest";

interface TaskFiltersProps {
  hosts: Host[];
  selectedHost: string;
  onHostSelect: (value: string) => void;
  eventTypes: string[];
  selectedEvent: string;
  onEventSelect: (value: string) => void;
}

export const TaskFilters = ({
  hosts,
  selectedHost,
  onHostSelect,
  eventTypes,
  selectedEvent,
  onEventSelect,
}: TaskFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <Select value={selectedHost} onValueChange={onHostSelect}>
        <SelectTrigger className="w-[200px] bg-white">
          <SelectValue placeholder="Filter by Host" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Hosts</SelectItem>
          {hosts.map((host) => (
            <SelectItem key={host.id} value={host.id}>
              {host.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedEvent} onValueChange={onEventSelect}>
        <SelectTrigger className="w-[200px] bg-white">
          <SelectValue placeholder="Filter by Event" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Events</SelectItem>
          {eventTypes.map((event) => (
            <SelectItem key={event} value={event}>
              {event}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};