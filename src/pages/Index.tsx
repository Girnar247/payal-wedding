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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHost, setSelectedHost] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [selectedAttribute, setSelectedAttribute] = useState<string>("");
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

  const { eventDetails, isLoading } = useEventState();

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guest.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guest.phone?.includes(searchTerm);
    const matchesHost = !selectedHost || guest.host_id === selectedHost;
    const matchesEvent = !selectedEvent || guest.events.includes(selectedEvent as EventType);
    const matchesAttribute = !selectedAttribute || guest.attributes.includes(selectedAttribute);
    
    return matchesSearch && matchesHost && matchesEvent && matchesAttribute;
  });

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-wedding-cream p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-playfair text-wedding-text">
            Payal's Wedding - Guest List
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {hosts.map((host) => (
                <Badge
                  key={host.id}
                  variant={selectedHost === host.id ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedHost(selectedHost === host.id ? "" : host.id)}
                >
                  {host.name}
                </Badge>
              ))}
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Input
                placeholder="Search guests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:w-1/3"
              />
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger className="md:w-1/3">
                  <SelectValue placeholder="Filter by event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Events</SelectItem>
                  {Object.keys(eventDetails).map((event) => (
                    <SelectItem key={event} value={event}>
                      {event.charAt(0).toUpperCase() + event.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedAttribute} onValueChange={setSelectedAttribute}>
                <SelectTrigger className="md:w-1/3">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="friend">Friend</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
              <DownloadGuestList guests={filteredGuests} hosts={hosts} />
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