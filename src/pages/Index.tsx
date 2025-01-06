import { useState } from "react";
import { AdminProvider } from "@/contexts/AdminContext";
import { useGuestState } from "@/hooks/useGuestState";
import { useEventState } from "@/hooks/useEventState";
import { EventConfiguration } from "@/components/EventConfiguration";
import { HeaderSection } from "@/components/index/HeaderSection";
import { InitialSideDialog } from "@/components/filters/InitialSideDialog";
import { GuestListContent } from "@/components/index/GuestListContent";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedSide, setSelectedSide] = useState<"bride" | "groom" | null>(null);
  const [showInitialDialog, setShowInitialDialog] = useState(true);

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

  // Filter guests by side first
  const sideFilteredGuests = guests.filter(guest => 
    selectedSide ? guest.side === selectedSide : true
  );
  
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

  const handleUpdateEventDetails = (eventType: any, details: any) => {
    addEvents({
      ...eventDetails,
      [eventType]: details
    });
  };

  const handleAddGuestWithSide = (data: any) => {
    handleAddGuest({ ...data, side: selectedSide });
  };

  const handleSideSelect = (side: "bride" | "groom") => {
    setSelectedSide(side);
    setShowInitialDialog(false);
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

        <InitialSideDialog
          isOpen={showInitialDialog}
          onSideSelect={handleSideSelect}
        />

        {!showInitialDialog && selectedSide && (
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
                <GuestListContent
                  selectedSide={selectedSide}
                  setSelectedSide={setSelectedSide}
                  guests={sideFilteredGuests}
                  hosts={hosts}
                  eventDetails={eventDetails}
                  handleAddGuest={handleAddGuestWithSide}
                  handleDeleteGuest={handleDeleteGuest}
                  handleUpdateStatus={handleUpdateStatus}
                  stats={stats}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </AdminProvider>
  );
};

export default Index;