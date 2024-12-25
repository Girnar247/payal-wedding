import { Guest, Host } from "@/types/guest";
import { useLocalStorage } from "./useLocalStorage";
import { useToast } from "@/components/ui/use-toast";

export const useGuestState = () => {
  const { toast } = useToast();
  const [guests, setGuests] = useLocalStorage<Guest[]>("guests", []);
  const [hosts, setHosts] = useLocalStorage<Host[]>("hosts", [
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

  const handleAddGuest = (data: Omit<Guest, "id" | "rsvpStatus">) => {
    const newGuest: Guest = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      rsvpStatus: "pending",
    };
    setGuests([...guests, newGuest]);
    toast({
      title: "Guest Added",
      description: `${data.name} has been added to the guest list.`,
    });
    return newGuest;
  };

  const handleDeleteGuest = (id: string) => {
    const guest = guests.find((g) => g.id === id);
    setGuests(guests.filter((g) => g.id !== id));
    if (guest) {
      toast({
        title: "Guest Removed",
        description: `${guest.name} has been removed from the guest list.`,
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = (id: string, status: "confirmed" | "declined") => {
    setGuests(
      guests.map((guest) =>
        guest.id === id ? { ...guest, rsvpStatus: status } : guest
      )
    );
    const guest = guests.find((g) => g.id === id);
    if (guest) {
      toast({
        title: `RSVP ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        description: `${guest.name}'s RSVP status has been updated to ${status}.`,
      });
    }
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
    return newHost;
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

  return {
    guests,
    hosts,
    handleAddGuest,
    handleDeleteGuest,
    handleUpdateStatus,
    handleAddHost,
    handleDeleteHost,
  };
};