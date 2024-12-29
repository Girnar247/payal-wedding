import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventType, Host } from "@/types/guest";
import { useIsMobile } from "@/hooks/use-mobile";

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedHost: string;
  onHostSelect: (value: string) => void;
  selectedEvent: string;
  onEventSelect: (value: string) => void;
  selectedAttribute: string;
  onAttributeSelect: (value: string) => void;
  hosts: Host[];
  eventDetails: Record<EventType, any>;
  resultCount?: number;
}

export const SearchAndFilters = ({
  searchTerm,
  onSearchChange,
  selectedHost,
  onHostSelect,
  selectedEvent,
  onEventSelect,
  selectedAttribute,
  onAttributeSelect,
  hosts,
  eventDetails,
  resultCount,
}: SearchAndFiltersProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col w-full md:w-64 gap-2">
          <Input
            placeholder="Search guests..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white"
          />
          {isMobile && resultCount !== undefined && (
            <p className="text-sm text-gray-600 px-1">
              {resultCount} result{resultCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 flex-1">
          <Select value={selectedHost} onValueChange={onHostSelect}>
            <SelectTrigger className="w-full md:w-48 bg-white">
              <SelectValue placeholder="Filter by Host" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-hosts">All Hosts</SelectItem>
              {hosts.map((host) => (
                <SelectItem key={host.id} value={host.id}>
                  {host.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedEvent} onValueChange={onEventSelect}>
            <SelectTrigger className="w-full md:w-48 bg-white">
              <SelectValue placeholder="Filter by Event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-events">All Events</SelectItem>
              {Object.keys(eventDetails).map((event) => (
                <SelectItem key={event} value={event}>
                  {event.charAt(0).toUpperCase() + event.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedAttribute} onValueChange={onAttributeSelect}>
            <SelectTrigger className="w-full md:w-48 bg-white">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-categories">All Categories</SelectItem>
              <SelectItem value="family">Family</SelectItem>
              <SelectItem value="friends">Friends</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="mohalla">Mohalla</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {!isMobile && resultCount !== undefined && (
        <p className="text-sm text-gray-600">
          {resultCount} result{resultCount !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};