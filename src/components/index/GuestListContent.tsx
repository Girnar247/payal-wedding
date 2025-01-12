import { useState } from "react";
import { EventSummary } from "@/components/EventSummary";
import { GuestListSection } from "@/components/index/GuestListSection";
import { SideSelector } from "@/components/filters/SideSelector";
import { SearchAndFilters } from "@/components/filters/SearchAndFilters";
import { Host } from "@/types/guest";
import { Dashboard } from "@/components/Dashboard";
import { useToast } from "@/hooks/use-toast";
import { AddGuestDialog } from "@/components/guest-card/AddGuestDialog";

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
  const { toast } = useToast();

  // Filter hosts based on the selected side
  const filteredHosts = hosts.filter(host => host.side === selectedSide);

  const handleAddGuestWithSide = (data: any) => {
    console.log('GuestListContent - Adding guest with explicit side:', selectedSide);
    const guestData = {
      ...data,
      side: selectedSide
    };
    console.log('GuestListContent - Final guest data:', guestData);
    handleAddGuest(guestData);
    
    toast({
      title: "Guest Added",
      description: `Guest has been added to the ${selectedSide === 'bride' ? "Bride's" : "Groom's"} side`,
    });
  };

  const handleSideChange = (newSide: "bride" | "groom") => {
    console.log('GuestListContent - Side changed to:', newSide);
    setSelectedSide(newSide);
    toast({
      title: "Side Changed",
      description: `Currently viewing: ${newSide === 'bride' ? "Bride's" : "Groom's"} Side`,
    });
  };

  return (
    <div className="space-y-4">
      <SideSelector
        selectedSide={selectedSide}
        onSideChange={handleSideChange}
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

      <div className="flex justify-end mb-4">
        <AddGuestDialog
          hosts={filteredHosts}
          onSubmit={handleAddGuestWithSide}
          side={selectedSide}
        />
      </div>

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
        filteredGuests={guests}
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
        side={selectedSide}
      />
    </div>
  );
};