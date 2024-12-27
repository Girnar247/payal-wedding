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
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

const Index = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const {
    guests,
    hosts,
    handleAddGuest,
    handleDeleteGuest,
    handleAddHost,
    handleDeleteHost,
  } = useGuestState();

  const { eventDetails, isLoading, addEvents } = useEventState();

  const handleUpdateEventDetails = async (
    eventType: EventType,
    details: EventDetails
  ) => {
    const initialEvents: Record<EventType, EventDetails> = {
      haldi: details,
      mehndi: details,
      mayra: details,
      sangeet: details,
      wedding: details,
    };

    if (Object.keys(eventDetails).length === 0) {
      await addEvents(initialEvents);
    }
  };

  const handleUpdateStatus = async (id: string, status: "confirmed" | "declined") => {
    const guest = guests.find(g => g.id === id);
    if (guest && status === "confirmed") {
      const confirmCount = window.prompt(
        `How many plus guests are attending? (0-${guest.plus_count})`,
        guest.plus_count?.toString()
      );
      if (confirmCount === null) return;
      const count = parseInt(confirmCount);
      if (isNaN(count) || count < 0 || count > (guest.plus_count || 0)) {
        toast({
          title: "Invalid Input",
          description: `Please enter a number between 0 and ${guest.plus_count}`,
          variant: "destructive",
        });
        return;
      }
      
      try {
        const { error } = await supabase
          .from('guests')
          .update({ 
            rsvp_status: status,
            plus_count: count 
          })
          .eq('id', id);

        if (error) throw error;
        
        queryClient.invalidateQueries({ queryKey: ['guests'] });
        queryClient.invalidateQueries({ queryKey: ['eventGuestCounts'] });
        
        toast({
          title: "Status Updated",
          description: "Guest's RSVP status has been updated.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update guest status.",
          variant: "destructive",
        });
      }
    } else {
      try {
        const { error } = await supabase
          .from('guests')
          .update({ rsvp_status: status })
          .eq('id', id);

        if (error) throw error;
        
        queryClient.invalidateQueries({ queryKey: ['guests'] });
        queryClient.invalidateQueries({ queryKey: ['eventGuestCounts'] });
        
        toast({
          title: "Status Updated",
          description: "Guest's RSVP status has been updated.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update guest status.",
          variant: "destructive",
        });
      }
    }
  };

  const stats = {
    totalGuests: guests.length,
    totalWithPlusOnes: guests.reduce((acc, guest) => acc + 1 + (guest.plus_count || 0), 0),
    confirmed: guests.filter((g) => g.rsvp_status === "confirmed").reduce((acc, guest) => acc + 1 + (guest.plus_count || 0), 0),
    declined: guests.filter((g) => g.rsvp_status === "declined").length,
    pending: guests.filter((g) => g.rsvp_status === "pending").length,
  };

  const defaultHost: Host = {
    id: "default",
    name: "Unassigned",
    email: "N/A",
    phone: "N/A",
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-wedding-cream p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-playfair text-wedding-text">
            Indian Wedding Guest Manager
          </h1>
          <p className="text-gray-600">Manage your special celebrations with elegance</p>
        </div>

        {Object.keys(eventDetails).length === 0 ? (
          <EventConfiguration
            eventDetails={eventDetails as Record<EventType, EventDetails>}
            hosts={hosts}
            onUpdateEvent={handleUpdateEventDetails}
            onAddHost={handleAddHost}
            onDeleteHost={handleDeleteHost}
            onComplete={() => {}}
          />
        ) : (
          <>
            <EventSummary events={eventDetails as Record<EventType, EventDetails>} />
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