import { useState } from "react";
import { EventSummary } from "@/components/EventSummary";
import { GuestListSection } from "@/components/index/GuestListSection";
import { SideSelector } from "@/components/filters/SideSelector";
import { SearchAndFilters } from "@/components/filters/SearchAndFilters";
import { Host } from "@/types/guest";

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

  const defaultHost = {
    id: "",
    name: "Unassigned",
    email: "",
    phone: "",
  };

  const handleAddGuestWithSide = (data: any) => {
    handleAddGuest({ ...data, side: selectedSide });
  };

  return (
    <div className="space-y-4">
      <SideSelector
        selectedSide={selectedSide}
        onSideChange={setSelectedSide}
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
        hosts={hosts}
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
        filteredGuests={guests}
        hosts={hosts}
        eventDetails={eventDetails}
        handleAddGuest={handleAddGuestWithSide}
        handleDeleteGuest={handleDeleteGuest}
        handleUpdateStatus={handleUpdateStatus}
        defaultHost={defaultHost}
      />
    </div>
  );
};