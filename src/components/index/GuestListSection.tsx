import { SearchAndFilters } from "@/components/filters/SearchAndFilters";
import { GuestActions } from "@/components/actions/GuestActions";
import { AddGuestForm } from "@/components/AddGuestForm";
import { GuestManagement } from "@/components/GuestManagement";
import { EventType, GuestAttribute, Host, Guest } from "@/types/guest";

interface GuestListSectionProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedHost: string;
  setSelectedHost: (value: string) => void;
  selectedEvent: string;
  setSelectedEvent: (value: string) => void;
  selectedAttribute: string;
  setSelectedAttribute: (value: string) => void;
  showAddForm: boolean;
  setShowAddForm: (value: boolean) => void;
  viewMode: "grid" | "list";
  setViewMode: (value: "grid" | "list") => void;
  filteredGuests: Guest[];
  hosts: Host[];
  eventDetails: Record<string, any>;
  handleAddGuest: (data: any) => void;
  handleDeleteGuest: (id: string) => void;
  handleUpdateStatus: (id: string, status: "confirmed" | "declined") => void;
  defaultHost: Host;
}

export const GuestListSection = ({
  searchTerm,
  setSearchTerm,
  selectedHost,
  setSelectedHost,
  selectedEvent,
  setSelectedEvent,
  selectedAttribute,
  setSelectedAttribute,
  showAddForm,
  setShowAddForm,
  viewMode,
  setViewMode,
  filteredGuests,
  hosts,
  eventDetails,
  handleAddGuest,
  handleDeleteGuest,
  handleUpdateStatus,
  defaultHost,
}: GuestListSectionProps) => {
  return (
    <div className="space-y-4">
      <SearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedHost={selectedHost}
        onHostSelect={setSelectedHost}
        selectedEvent={selectedEvent}
        onEventSelect={setSelectedEvent}
        selectedAttribute={selectedAttribute}
        onAttributeSelect={setSelectedAttribute}
        hosts={hosts}
        eventDetails={eventDetails}
        resultCount={filteredGuests.length}
      />

      <div className="flex justify-end items-center gap-4">
        <p className="text-sm text-gray-600">
          {filteredGuests.length} result{filteredGuests.length !== 1 ? 's' : ''}
        </p>

        <GuestActions
          showAddForm={showAddForm}
          setShowAddForm={setShowAddForm}
          filteredGuests={filteredGuests}
          hosts={hosts}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
      </div>

      {showAddForm && <AddGuestForm onSubmit={handleAddGuest} hosts={hosts} />}

      <GuestManagement
        guests={filteredGuests}
        hosts={hosts}
        defaultHost={defaultHost}
        onDeleteGuest={handleDeleteGuest}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};