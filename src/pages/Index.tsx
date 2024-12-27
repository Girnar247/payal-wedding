import { useState } from "react";
import { AddGuestForm } from "@/components/AddGuestForm";
import { Dashboard } from "@/components/Dashboard";
import { EventSummary } from "@/components/EventSummary";
import { Button } from "@/components/ui/button";
import { PlusCircle, MinusCircle, Download, LayoutGrid, List } from "lucide-react";
import { EventType, EventDetails, Host, GuestAttribute } from "@/types/guest";
import { GuestManagement } from "@/components/GuestManagement";
import { EventConfiguration } from "@/components/EventConfiguration";
import { DownloadGuestList } from "@/components/DownloadGuestList";
import { useGuestState } from "@/hooks/useGuestState";
import { useEventState } from "@/hooks/useEventState";
import { useGuestStats } from "@/hooks/useGuestStats";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InvitationTemplateDialog } from "@/components/InvitationTemplateDialog";

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
              <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
                <Input
                  placeholder="Search guests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64"
                />
                <div className="flex gap-2">
                  <Select value={selectedHost} onValueChange={setSelectedHost}>
                    <SelectTrigger className="w-full md:w-48 bg-white">
                      <SelectValue placeholder="Filter by Host" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-hosts">All Hosts</SelectItem>
                      {hosts.map((host) => (
                        <SelectItem key={host.id} value={host.id}>
                          {host.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                    <SelectTrigger className="w-full md:w-48 bg-white">
                      <SelectValue placeholder="Filter by Event" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-events">All Events</SelectItem>
                      {Object.keys(eventDetails).map((event) => (
                        <SelectItem key={event} value={event}>
                          {event.charAt(0).toUpperCase() + event.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedAttribute} onValueChange={setSelectedAttribute}>
                    <SelectTrigger className="w-full md:w-48 bg-white">
                      <SelectValue placeholder="Filter by Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-categories">All Categories</SelectItem>
                      <SelectItem value="family">Family</SelectItem>
                      <SelectItem value="friends">Friends</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="mohalla">Mohalla</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <Button
                  onClick={() => setShowAddForm(!showAddForm)}
                  variant="outline"
                  className="w-full md:w-auto bg-white/50 hover:bg-white/80"
                >
                  {showAddForm ? (
                    <>
                      <MinusCircle className="mr-2 h-4 w-4" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add New Guest
                    </>
                  )}
                </Button>

                <div className="flex items-center gap-2">
                  <DownloadGuestList guests={filteredGuests} hosts={hosts} />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                    className="bg-white/50 hover:bg-white/80"
                  >
                    {viewMode === "grid" ? (
                      <List className="h-4 w-4" />
                    ) : (
                      <LayoutGrid className="h-4 w-4" />
                    )}
                  </Button>
                </div>
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
  );
};

export default Index;