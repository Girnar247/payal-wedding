import { useState } from "react";
import { AddGuestForm } from "@/components/AddGuestForm";
import { Dashboard } from "@/components/Dashboard";
import { EventSummary } from "@/components/EventSummary";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { PlusCircle, MinusCircle } from "lucide-react";
import { Guest, Host, EventType, EventDetails } from "@/types/guest";
import { GuestManagement } from "@/components/GuestManagement";
import { EventConfiguration } from "@/components/EventConfiguration";
import { DownloadGuestList } from "@/components/DownloadGuestList";

const Index = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEventConfig, setShowEventConfig] = useState(true);
  const { toast } = useToast();

  const [hosts, setHosts] = useState<Host[]>([
    {
      id: "1",
      name: "Rahul Sharma",
      email: "rahul@example.com",
      phone: "+91 98765 43210",
    },
    {
      id: "2",
      name: "Priya Patel",
      email: "priya@example.com",
      phone: "+91 98765 43211",
    },
  ]);

  const [eventDetails, setEventDetails] = useState<Record<EventType, EventDetails>>({
    haldi: {
      date: new Date(2024, 5, 1),
      time: "10:00 AM",
      venue: "Residence Garden",
    },
    mehndi: {
      date: new Date(2024, 5, 2),
      time: "11:00 AM",
      venue: "Banquet Hall",
    },
    mayra: {
      date: new Date(2024, 5, 2),
      time: "5:00 PM",
      venue: "Family Temple",
    },
    sangeet: {
      date: new Date(2024, 5, 3),
      time: "7:00 PM",
      venue: "Grand Ballroom",
    },
    wedding: {
      date: new Date(2024, 5, 4),
      time: "7:00 PM",
      venue: "Royal Palace Gardens",
    },
  });

  const handleAddGuest = (data: Omit<Guest, "id" | "rsvpStatus">) => {
    const newGuest: Guest = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      rsvpStatus: "pending",
    };
    setGuests([...guests, newGuest]);
    setShowAddForm(false);
    toast({
      title: "Guest Added",
      description: `${data.name} has been added to the guest list.`,
    });
  };

  const handleDeleteGuest = (id: string) => {
    const guest = guests.find((g) => g.id === id);
    setGuests(guests.filter((g) => g.id !== id));
    toast({
      title: "Guest Removed",
      description: `${guest?.name} has been removed from the guest list.`,
      variant: "destructive",
    });
  };

  const handleUpdateStatus = (id: string, status: "confirmed" | "declined") => {
    setGuests(
      guests.map((guest) =>
        guest.id === id ? { ...guest, rsvpStatus: status } : guest
      )
    );
    const guest = guests.find((g) => g.id === id);
    toast({
      title: `RSVP ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      description: `${guest?.name}'s RSVP status has been updated to ${status}.`,
    });
  };

  const handleUpdateEventDetails = (
    eventType: EventType,
    details: EventDetails
  ) => {
    setEventDetails((prev) => ({
      ...prev,
      [eventType]: details,
    }));
    toast({
      title: "Event Updated",
      description: `${
        eventType.charAt(0).toUpperCase() + eventType.slice(1)
      } details have been updated.`,
    });
  };

  const handleAddHost = (host: Omit<Host, "id">) => {
    const newHost: Host = {
      ...host,
      id: Math.random().toString(36).substr(2, 9),
    };
    setHosts([...hosts, newHost]);
    toast({
      title: "Host Added",
      description: `${host.name} has been added as an event host.`,
    });
  };

  const handleDeleteHost = (id: string) => {
    const host = hosts.find((h) => h.id === id);
    if (host) {
      setHosts(hosts.filter((h) => h.id !== id));
      toast({
        title: "Host Removed",
        description: `${host.name} has been removed from the host list.`,
      });
    }
  };

  const stats = {
    totalGuests: guests.length,
    totalWithPlusOnes: guests.reduce((acc, guest) => acc + 1 + guest.plusCount, 0),
    confirmed: guests.filter((g) => g.rsvpStatus === "confirmed").length,
    declined: guests.filter((g) => g.rsvpStatus === "declined").length,
    pending: guests.filter((g) => g.rsvpStatus === "pending").length,
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