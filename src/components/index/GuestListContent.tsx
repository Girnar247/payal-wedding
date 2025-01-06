import { useState } from "react";
import { EventSummary } from "@/components/EventSummary";
import { GuestListSection } from "@/components/index/GuestListSection";
import { SideSelector } from "@/components/filters/SideSelector";
import { SearchAndFilters } from "@/components/filters/SearchAndFilters";
import { Host } from "@/types/guest";
import { Dashboard } from "@/components/Dashboard";

interface GuestListContentProps {
  selectedSide: "bride" | "groom";
  setSelectedSide: (side: "bride" | "groom") => void;
  guests: any[];
  hosts: Host[];
  eventDetails: any;
  handleAddGuest: (data: any) => void;
  handleDeleteGuest: (id: string) => void;
  handleUpdateStatus: (id: string, status: "confirmed" | "declined") => void;
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHost, setSelectedHost] = useState<string>("all-hosts");
  const [selectedEvent, setSelectedEvent] = useState<string>("all-events");
  const [selectedAttribute, setSelectedAttribute] = useState<string>("all-categories");
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Filter hosts based on the selected side
  const filteredHosts = hosts.filter(host => host.side === selectedSide);

  // Filter guests based on search and filters
  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHost = selectedHost === "all-hosts" || guest.host_id === selectedHost;
    const matchesEvent = selectedEvent === "all-events" || guest.events.includes(selectedEvent);
    const matchesAttribute = selectedAttribute === "all-categories" || guest.attributes.includes(selectedAttribute);
    const matchesStatus = !statusFilter || 
      (statusFilter === "accommodation" ? guest.accommodation_required : guest.rsvp_status === statusFilter);

    return matchesSearch && matchesHost && matchesEvent && matchesAttribute && matchesStatus;
  });

  const handleAddGuestWithSide = (data: any) => {
    // Ensure the side is set correctly
    const guestData = {
      ...data,
      side: selectedSide
    };
    handleAddGuest(guestData);
  };

  return (
    <div className="space-y-4">
      <SideSelector
        selectedSide={selectedSide}
        onSideChange={setSelectedSide}
      />

      <Dashboard
        totalGuests={stats.totalGuests}
        totalWithPlusOnes={stats.totalWithPlusOnes}
        confirmed={stats.confirmed}
        declined={stats.declined}
        pending={stats.pending}
        accommodationRequired={stats.accommodationRequired}
        onFilterByStatus={setStatusFilter}
      />

      <SearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedHost={selectedHost}
        onHostSelect={setSelectedHost}
        selectedEvent={selectedEvent}
        onEventSelect={setSelectedEvent}
        selectedAttribute={selectedAttribute}
        onAttributeSelect={setSelectedAttribute}
        hosts={filteredHosts}
        eventDetails={eventDetails}
      />

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
        hosts={filteredHosts}
        eventDetails={eventDetails}
        handleAddGuest={handleAddGuestWithSide}
        handleDeleteGuest={handleDeleteGuest}
        handleUpdateStatus={handleUpdateStatus}
        defaultHost={filteredHosts[0] || {
          id: "",
          name: "Unassigned",
          email: "",
          phone: "",
          side: selectedSide
        }}
      />
    </div>
  );
};