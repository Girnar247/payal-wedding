import { useState } from "react";
import { AddGuestForm } from "@/components/AddGuestForm";
import { Dashboard } from "@/components/Dashboard";
import { EventSummary } from "@/components/EventSummary";
import { EventType, GuestAttribute, Host, EventDetails } from "@/types/guest";
import { GuestManagement } from "@/components/GuestManagement";
import { EventConfiguration } from "@/components/EventConfiguration";
import { useGuestState } from "@/hooks/useGuestState";
import { useEventState } from "@/hooks/useEventState";
import { useGuestStats } from "@/hooks/useGuestStats";
import { SearchAndFilters } from "@/components/filters/SearchAndFilters";
import { GuestActions } from "@/components/actions/GuestActions";

const defaultHost: Host = {
  id: "",
  name: "Unassigned",
  email: "",
  phone: "",
};

const Index = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHost, setSelectedHost] = useState<string>("all-hosts");
  const [selectedEvent, setSelectedEvent] = useState<string>("all-events");
  const [selectedAttribute, setSelectedAttribute] = useState<string>("all-categories");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const {
    guests,
    hosts,
    handleAddGuest,
    handleDeleteGuest,
    handleUpdateStatus,
    handleAddHost,
    handleDeleteHost,
  } = useGuestState();

  const { eventDetails, isLoading, addEvents } = useEventState();
  const stats = useGuestStats(guests);

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guest.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guest.phone?.includes(searchTerm);
    const matchesHost = selectedHost === "all-hosts" || guest.host_id === selectedHost;
    const matchesEvent = selectedEvent === "all-events" || guest.events.includes(selectedEvent as EventType);
    const matchesAttribute = selectedAttribute === "all-categories" || guest.attributes.includes(selectedAttribute as GuestAttribute);
    
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
    <div 
      className="min-h-screen bg-wedding-cream p-6 md:p-8"
      style={{
        backgroundImage: eventDetails?.wedding?.main_background_url ? 
          `url(${eventDetails.wedding.main_background_url})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-playfair text-wedding-text">
            Payal's Wedding - Guest List
          </h1>
          <p className="text-gray-600">Manage your special celebrations with elegance</p>
        </div>

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

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
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
          </>
        )}
      </div>
    </div>
  );
};

export default Index;