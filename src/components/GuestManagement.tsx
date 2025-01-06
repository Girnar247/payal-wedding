import { useState } from "react";
import { GuestList } from "@/components/GuestList";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
import { Guest, Host, EventType, GuestAttribute } from "@/types/guest";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GuestManagementProps {
  guests: Guest[];
  hosts: Host[];
  defaultHost: Host;
  onDeleteGuest: (id: string) => void;
  onUpdateStatus: (id: string, status: "confirmed" | "declined" | "pending") => void;
  searchTerm?: string;
  selectedHost?: string;
  selectedEvent?: string | "all-events";
  selectedAttribute?: string | "all-categories";
  statusFilter?: string | null;
}

export const GuestManagement = ({
  guests,
  hosts,
  defaultHost,
  onDeleteGuest,
  onUpdateStatus,
  searchTerm = "",
  selectedHost = "all-hosts",
  selectedEvent = "all-events",
  selectedAttribute = "all-categories",
  statusFilter = null,
}: GuestManagementProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { toast } = useToast();

  const filteredGuests = guests.filter((guest) => {
    // Search term filter
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      guest.name.toLowerCase().includes(searchLower) ||
      (guest.email?.toLowerCase().includes(searchLower) ?? false) ||
      (guest.phone?.toLowerCase().includes(searchLower) ?? false);

    // Apply host filter
    const matchesHost = selectedHost === "all-hosts" || guest.host_id === selectedHost;

    // Apply event filter with type checking
    const matchesEvent = selectedEvent === "all-events" || 
      guest.events.includes(selectedEvent as EventType);

    // Apply category/attribute filter with type checking
    const matchesAttribute = selectedAttribute === "all-categories" || 
      guest.attributes.includes(selectedAttribute as GuestAttribute);

    // Apply status filter if present
    const matchesStatus = !statusFilter ? true : 
      statusFilter === "accommodation" ? guest.accommodation_required : 
      guest.rsvp_status === statusFilter;

    return matchesSearch && matchesHost && matchesEvent && matchesAttribute && matchesStatus;
  });

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
    toast({
      title: `View Changed`,
      description: `Switched to ${mode} view`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2">
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          size="icon"
          onClick={() => handleViewModeChange("grid")}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="icon"
          onClick={() => handleViewModeChange("list")}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

      <GuestList
        guests={filteredGuests}
        hosts={hosts}
        defaultHost={defaultHost}
        onDeleteGuest={onDeleteGuest}
        onUpdateStatus={onUpdateStatus}
        viewMode={viewMode}
      />
    </div>
  );
};