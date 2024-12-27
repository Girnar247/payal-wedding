import { useState } from "react";
import { AddGuestForm } from "@/components/AddGuestForm";
import { Dashboard } from "@/components/Dashboard";
import { EventSummary } from "@/components/EventSummary";
import { Button } from "@/components/ui/button";
import { PlusCircle, MinusCircle } from "lucide-react";
import { EventType, EventDetails, Host } from "@/types/guest";
import { GuestManagement } from "@/components/GuestManagement";
import { EventConfiguration } from "@/components/EventConfiguration";
import { DownloadGuestList } from "@/components/DownloadGuestList";
import { useGuestState } from "@/hooks/useGuestState";
import { useEventState } from "@/hooks/useEventState";

const Index = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEventConfig, setShowEventConfig] = useState(true);
  
  const {
    guests,
    hosts,
    handleAddGuest,
    handleDeleteGuest,
    handleUpdateStatus,
    handleAddHost,
    handleDeleteHost,
  } = useGuestState();

  const { eventDetails, setEventDetails } = useEventState();

  const handleUpdateEventDetails = (
    eventType: EventType,
    details: EventDetails
  ) => {
    setEventDetails((prev) => ({
      ...prev,
      [eventType]: details,
    }));
  };

  const stats = {
    totalGuests: guests.length,
    totalWithPlusOnes: guests.reduce((acc, guest) => acc + 1 + guest.plus_count, 0),
    confirmed: guests.filter((g) => g.rsvp_status === "confirmed").length,
    declined: guests.filter((g) => g.rsvp_status === "declined").length,
    pending: guests.filter((g) => g.rsvp_status === "pending").length,
  };

  const defaultHost: Host = {
    id: "default",
    name: "Unassigned",
    email: "N/A",
    phone: "N/A",
  };

  return (
    <div className="min-h-screen bg-wedding-cream p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-playfair text-wedding-text">
            Indian Wedding Guest Manager
          </h1>
          <p className="text-gray-600">Manage your special celebrations with elegance</p>
        </div>

        {showEventConfig ? (
          <EventConfiguration
            eventDetails={eventDetails}
            hosts={hosts}
            onUpdateEvent={handleUpdateEventDetails}
            onAddHost={handleAddHost}
            onDeleteHost={handleDeleteHost}
            onComplete={() => setShowEventConfig(false)}
          />
        ) : (
          <>
            <EventSummary events={eventDetails} />
            <Dashboard {...stats} />

            <div className="flex justify-between items-center">
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                variant="outline"
                className="bg-white/50 hover:bg-white/80"
              >
                {showAddForm ? (
                  <>
                    <MinusCircle className="mr-2 h-4 w-4" />
                    Cancel Adding Guest
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Guest
                  </>
                )}
              </Button>
              <DownloadGuestList guests={guests} hosts={hosts} />
            </div>

            {showAddForm && <AddGuestForm onSubmit={handleAddGuest} hosts={hosts} />}

            <GuestManagement
              guests={guests}
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