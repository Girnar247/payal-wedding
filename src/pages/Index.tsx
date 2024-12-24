import { useState } from "react";
import { AddGuestForm } from "@/components/AddGuestForm";
import { GuestCard } from "@/components/GuestCard";
import { Dashboard } from "@/components/Dashboard";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { PlusCircle, MinusCircle } from "lucide-react";

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  rsvpStatus: "pending" | "confirmed" | "declined";
  plusGuests: number;
  events: string[];
}

const Index = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

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

  const stats = {
    totalGuests: guests.reduce((acc, guest) => acc + 1 + guest.plusGuests, 0),
    confirmed: guests.filter((g) => g.rsvpStatus === "confirmed").length,
    declined: guests.filter((g) => g.rsvpStatus === "declined").length,
    pending: guests.filter((g) => g.rsvpStatus === "pending").length,
  };

  return (
    <div className="min-h-screen bg-wedding-cream p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-playfair text-wedding-text">
            Indian Wedding Guest Manager
          </h1>
          <p className="text-gray-600">Manage your special day with elegance</p>
        </div>

        <Dashboard {...stats} />

        <div className="flex justify-center">
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
        </div>

        {showAddForm && <AddGuestForm onSubmit={handleAddGuest} />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guests.map((guest) => (
            <GuestCard
              key={guest.id}
              guest={guest}
              onEdit={() => {}}
              onDelete={handleDeleteGuest}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>

        {guests.length === 0 && !showAddForm && (
          <div className="text-center py-12 text-gray-500">
            <p>No guests added yet. Click the button above to add your first guest.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;