import { useState } from "react";
import { EventSummary } from "@/components/EventSummary";
import { Dashboard } from "@/components/Dashboard";
import { GuestListSection } from "@/components/index/GuestListSection";
import { SideSelector } from "@/components/filters/SideSelector";
import { Host } from "@/types/guest";

interface GuestListContentProps {
  selectedSide: "bride" | "groom";
  setSelectedSide: (side: "bride" | "groom") => void;
  guests: any[];
  hosts: Host[];
  eventDetails: any;
  handleAddGuest: (data: any) => void;
  handleDeleteGuest: (id: string) => void;
  handleUpdateStatus: (id: string, status: string) => void;
  stats: {
    totalGuests: number;
    totalWithPlusOnes: number;
    confirmed: number;
    declined: number;
    pending: number;
    accommodationRequired: number;
  };
}

export const GuestListContent = ({
  selectedSide,
  setSelectedSide,
  guests,
  hosts,
  eventDetails,
  handleAddGuest,
  handleDeleteGuest,
  handleUpdateStatus,
  stats
}: GuestListContentProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHost, setSelectedHost] = useState<string>("all-hosts");
  const [selectedEvent, setSelectedEvent] = useState<string>("all-events");
  const [selectedAttribute, setSelectedAttribute] = useState<string>("all-categories");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const defaultHost = {
    id: "",
    name: "Unassigned",
    email: "",
    phone: "",
  };

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guest.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guest.phone?.includes(searchTerm);
    const matchesHost = selectedHost === "all-hosts" || guest.host_id === selectedHost;
    const matchesEvent = selectedEvent === "all-events" || guest.events.includes(selectedEvent);
    const matchesAttribute = selectedAttribute === "all-categories" || guest.attributes.includes(selectedAttribute);
    const matchesStatus = !statusFilter ? true : 
                         statusFilter === "accommodation" ? guest.accommodation_required :
                         guest.rsvp_status === statusFilter;
    
    return matchesSearch && matchesHost && matchesEvent && matchesAttribute && matchesStatus;
  });

  return (
    <>
      <div className="max-w-xl mx-auto mb-8">
        <SideSelector
          selectedSide={selectedSide}
          onSideChange={setSelectedSide}
        />
      </div>
      <EventSummary events={eventDetails} />
      <Dashboard {...stats} onFilterByStatus={setStatusFilter} />
      <GuestListSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedHost={selectedHost}
        setSelectedHost={setSelectedHost}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        selectedAttribute={selectedAttribute}
        setSelectedAttribute={setSelectedAttribute}
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
        viewMode={viewMode}
        setViewMode={setViewMode}
        filteredGuests={filteredGuests}
        hosts={hosts}
        eventDetails={eventDetails}
        handleAddGuest={handleAddGuest}
        handleDeleteGuest={handleDeleteGuest}
        handleUpdateStatus={handleUpdateStatus}
        defaultHost={defaultHost}
      />
    </>
  );
};