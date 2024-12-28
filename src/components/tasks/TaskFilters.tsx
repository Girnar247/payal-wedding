import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Host } from "@/types/guest";

interface TaskFiltersProps {
  hosts: Host[];
  selectedHost: string;
  onHostSelect: (hostId: string) => void;
  eventTypes: string[];
  selectedEvent: string;
  onEventSelect: (event: string) => void;
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
    <div className="flex flex-wrap gap-4">
      <div className="w-full md:w-64">
        <Select value={selectedHost} onValueChange={onHostSelect}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Filter by host" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Hosts</SelectItem>
            {hosts?.map((host) => (
              <SelectItem key={host.id} value={host.id}>
                {host.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full md:w-64">
        <Select value={selectedEvent} onValueChange={onEventSelect}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Filter by event" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            {eventTypes?.map((event) => (
              <SelectItem key={event} value={event}>
                {event.charAt(0).toUpperCase() + event.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};