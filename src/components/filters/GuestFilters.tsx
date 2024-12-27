import { EventType, GuestAttribute } from "@/types/guest";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GuestFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedEvent: string;
  onEventChange: (value: string) => void;
  selectedAttribute: string;
  onAttributeChange: (value: string) => void;
  eventDetails: Record<EventType, any>;
}

export const GuestFilters = ({
  searchTerm,
  onSearchChange,
  selectedEvent,
  onEventChange,
  selectedAttribute,
  onAttributeChange,
  eventDetails,
}: GuestFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <Input
        placeholder="Search guests..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="md:w-1/3"
      />
      <Select value={selectedEvent} onValueChange={onEventChange}>
        <SelectTrigger className="md:w-1/3">
          <SelectValue placeholder="Filter by event" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Events</SelectItem>
          {Object.keys(eventDetails).map((event) => (
            <SelectItem key={event} value={event}>
              {event.charAt(0).toUpperCase() + event.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={selectedAttribute} onValueChange={onAttributeChange}>
        <SelectTrigger className="md:w-1/3">
          <SelectValue placeholder="Filter by category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="family">Family</SelectItem>
          <SelectItem value="friends">Friends</SelectItem>
          <SelectItem value="staff">Staff</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};