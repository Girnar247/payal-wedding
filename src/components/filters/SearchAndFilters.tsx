import { memo } from "react";
import { EventType, Host } from "@/types/guest";
import { SearchInput } from "./SearchInput";
import { FilterSelects } from "./FilterSelects";

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

export const SearchAndFilters = memo(function SearchAndFilters({
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
}: SearchAndFiltersProps) {
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput value={searchTerm} onChange={onSearchChange} />
        <FilterSelects
          selectedHost={selectedHost}
          onHostSelect={onHostSelect}
          selectedEvent={selectedEvent}
          onEventSelect={onEventSelect}
          selectedAttribute={selectedAttribute}
          onAttributeSelect={onAttributeSelect}
          hosts={hosts}
          eventDetails={eventDetails}
        />
      </div>
    </div>
  );
});