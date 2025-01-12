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
  side: "bride" | "groom"; // Added the side prop to the interface
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
  side, // Added side to the destructured props
}: GuestListSectionProps) => {
  return (
    <div className="space-y-4">
      <GuestActions
        filteredGuests={filteredGuests}
        hosts={hosts}
        viewMode={viewMode}
        setViewMode={setViewMode}
        resultCount={filteredGuests.length}
        onAddGuest={handleAddGuest}
        side={side}
      />

      {showAddForm && (
        <AddGuestForm 
          onSubmit={handleAddGuest} 
          hosts={hosts} 
          side={side}
        />
      )}

      <GuestManagement
        guests={filteredGuests}
        hosts={hosts}
        defaultHost={defaultHost}
        onDeleteGuest={handleDeleteGuest}
        onUpdateStatus={handleUpdateStatus}
        searchTerm={searchTerm}
      />
    </div>
  );
};