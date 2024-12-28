import { useState } from "react";
import { AdminProvider } from "@/contexts/AdminContext";
import { useGuestState } from "@/hooks/useGuestState";
import { useEventState } from "@/hooks/useEventState";
import { useGuestStats } from "@/hooks/useGuestStats";
import { EventSummary } from "@/components/EventSummary";
import { Dashboard } from "@/components/Dashboard";
import { EventConfiguration } from "@/components/EventConfiguration";
import { HeaderSection } from "@/components/index/HeaderSection";
import { GuestListSection } from "@/components/index/GuestListSection";
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
  const stats = useGuestStats(guests);

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

  const filteredGuests = guests.filter(guest => {
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
                <EventSummary events={eventDetails} />
                <Dashboard {...stats} />
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
            )}
          </div>
        </div>
      </div>
    </AdminProvider>
  );
};

export default Index;