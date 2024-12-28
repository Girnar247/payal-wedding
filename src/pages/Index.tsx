import { useState } from "react";
import { Link } from "react-router-dom";
import { AddGuestForm } from "@/components/AddGuestForm";
import { Dashboard } from "@/components/Dashboard";
import { EventSummary } from "@/components/EventSummary";
import { GuestManagement } from "@/components/GuestManagement";
import { EventConfiguration } from "@/components/EventConfiguration";
import { useGuestState } from "@/hooks/useGuestState";
import { useEventState } from "@/hooks/useEventState";
import { useGuestStats } from "@/hooks/useGuestStats";
import { SearchAndFilters } from "@/components/filters/SearchAndFilters";
import { GuestActions } from "@/components/actions/GuestActions";
import { AdminProvider } from "@/contexts/AdminContext";
import { AdminButton } from "@/components/AdminButton";
import { Button } from "@/components/ui/button";
import { ClipboardList, Heart, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const defaultHost = {
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
    const matchesEvent = selectedEvent === "all-events" || guest.events.includes(selectedEvent);
    const matchesAttribute = selectedAttribute === "all-categories" || guest.attributes.includes(selectedAttribute);
    
    return matchesSearch && matchesHost && matchesEvent && matchesAttribute;
  });

  const handleUpdateEventDetails = (eventType: EventType, details: EventDetails) => {
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
        <div 
          className="bg-cover bg-center bg-no-repeat py-8 relative"
          style={{
            backgroundImage: eventDetails?.wedding?.main_background_url ? 
              `url(${eventDetails.wedding.main_background_url})` : 'none',
          }}
        >
          <div className="absolute inset-0 bg-white/40" />
          
          <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
            <div className="flex justify-between items-center">
              <div className="text-center space-y-2">
                <h1 className="text-4xl md:text-5xl font-playfair text-wedding-text">
                  Payal's Wedding - Guest List
                </h1>
                <p className="text-gray-600">Manage your special celebrations with elegance</p>
              </div>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  className="bg-white/50 hover:bg-white/80"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Link to="/wedding-summary">
                  <Button variant="outline" className="bg-white/50 hover:bg-white/80">
                    <Heart className="h-4 w-4 mr-2" />
                    Wedding Summary
                  </Button>
                </Link>
                <Link to="/tasks">
                  <Button variant="outline" className="bg-white/50 hover:bg-white/80">
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Tasks
                  </Button>
                </Link>
                <AdminButton />
              </div>
            </div>
          </div>
        </div>

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
                </div>

                {showAddForm && <AddGuestForm onSubmit={handleAddGuest} hosts={hosts} />}

                <GuestManagement
                  guests={filteredGuests}
                  hosts={hosts}
                  defaultHost={defaultHost}
                  onDeleteGuest={handleDeleteGuest}
                  onUpdateStatus={handleUpdateStatus}
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
