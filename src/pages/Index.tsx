import { useState } from "react";
import { AdminProvider } from "@/contexts/AdminContext";
import { useGuestState } from "@/hooks/useGuestState";
import { useEventState } from "@/hooks/useEventState";
import { EventSummary } from "@/components/EventSummary";
import { Dashboard } from "@/components/Dashboard";
import { EventConfiguration } from "@/components/EventConfiguration";
import { HeaderSection } from "@/components/index/HeaderSection";
import { GuestListSection } from "@/components/index/GuestListSection";
import { SideSelector } from "@/components/filters/SideSelector";
import { useToast } from "@/hooks/use-toast";
import { EventType, GuestAttribute, Host } from "@/types/guest";

const defaultHost: Host = {
  id: "",
  name: "Unassigned",
  email: "",
  phone: "",
};

const Index = () => {
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHost, setSelectedHost] = useState<string>("all-hosts");
  const [selectedEvent, setSelectedEvent] = useState<string>("all-events");
  const [selectedAttribute, setSelectedAttribute] = useState<string>("all-categories");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedSide, setSelectedSide] = useState<"bride" | "groom">("bride");

  const {
    guests,
    hosts,
    handleAddGuest,
    handleDeleteGuest,
    handleUpdateStatus,
    handleAddHost,
    handleDeleteHost,
    refreshData
  } = useGuestState();

  const { eventDetails, isLoading, addEvents } = useEventState();

  // Filter guests by side first, then apply other filters
  const sideFilteredGuests = guests.filter(guest => guest.side === selectedSide);
  
  const stats = {
    totalGuests: sideFilteredGuests.length,
    totalWithPlusOnes: sideFilteredGuests.reduce((acc, guest) => acc + 1 + (guest.plus_count || 0), 0),
    confirmed: sideFilteredGuests.reduce((acc, guest) => {
      if (guest.rsvp_status === "confirmed") {
        return acc + 1 + (guest.plus_count || 0);
      }
      return acc;
    }, 0),
    declined: sideFilteredGuests.reduce((acc, guest) => {
      if (guest.rsvp_status === "declined") {
        return acc + 1 + (guest.plus_count || 0);
      }
      return acc;
    }, 0),
    pending: sideFilteredGuests.reduce((acc, guest) => {
      if (guest.rsvp_status === "pending") {
        return acc + 1 + (guest.plus_count || 0);
      }
      return acc;
    }, 0),
    accommodationRequired: sideFilteredGuests.reduce((acc, guest) => {
      if (guest.accommodation_required) {
        return acc + guest.accommodation_count;
      }
      return acc;
    }, 0),
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
      toast({
        title: "Refreshed",
        description: "The guest list has been refreshed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh the data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredGuests = sideFilteredGuests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guest.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guest.phone?.includes(searchTerm);
    const matchesHost = selectedHost === "all-hosts" || guest.host_id === selectedHost;
    const matchesEvent = selectedEvent === "all-events" || guest.events.includes(selectedEvent as EventType);
    const matchesAttribute = selectedAttribute === "all-categories" || guest.attributes.includes(selectedAttribute as GuestAttribute);
    
    return matchesSearch && matchesHost && matchesEvent && matchesAttribute;
  });

  const handleUpdateEventDetails = (eventType: EventType, details: any) => {
    addEvents({
      ...eventDetails,
      [eventType]: details
    });
  };

  const handleAddGuestWithSide = (data: any) => {
    handleAddGuest({ ...data, side: selectedSide });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AdminProvider>
      <div className="min-h-screen">
        <HeaderSection 
          eventDetails={eventDetails}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
        />

        <div className="bg-wedding-cream">
          <div className="max-w-7xl mx-auto px-6 md:px-8 py-8 space-y-8">
            {Object.keys(eventDetails).length === 0 ? (
              <EventConfiguration
                eventDetails={eventDetails}
                hosts={hosts}
                onUpdateEvent={handleUpdateEventDetails}
                onAddHost={handleAddHost}
                onDeleteHost={handleDeleteHost}
                onComplete={() => {}}
              />
            ) : (
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
                  filteredGuests={filteredGuests.filter(guest => {
                    if (!statusFilter) return true;
                    if (statusFilter === "accommodation") return guest.accommodation_required;
                    return guest.rsvp_status === statusFilter;
                  })}
                  hosts={hosts}
                  eventDetails={eventDetails}
                  handleAddGuest={handleAddGuestWithSide}
                  handleDeleteGuest={handleDeleteGuest}
                  handleUpdateStatus={handleUpdateStatus}
                  defaultHost={defaultHost}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </AdminProvider>
  );
};

export default Index;