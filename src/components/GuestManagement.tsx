import { useState } from "react";
import { GuestCard } from "@/components/GuestCard";
import { GuestList } from "@/components/GuestList";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
import { Guest, Host } from "@/types/guest";
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
  selectedEvent?: string;
  selectedAttribute?: string;
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
}: GuestManagementProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "category">("name");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { toast } = useToast();

  // Filter and sort guests
  const filteredAndSortedGuests = [...guests]
    .filter(guest => {
      // Apply search filter
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = guest.name.toLowerCase().includes(searchLower);
      const emailMatch = guest.email?.toLowerCase().includes(searchLower) || false;
      const phoneMatch = guest.phone?.toLowerCase().includes(searchLower) || false;
      const matchesSearch = nameMatch || emailMatch || phoneMatch;

      // Apply host filter
      const matchesHost = selectedHost === "all-hosts" || guest.host_id === selectedHost;

      // Apply event filter
      const matchesEvent = selectedEvent === "all-events" || guest.events.includes(selectedEvent);

      // Apply category/attribute filter
      const matchesAttribute = selectedAttribute === "all-categories" || guest.attributes.includes(selectedAttribute);

      // Apply status filter if present
      if (statusFilter) {
        if (statusFilter === "accommodation") {
          return guest.accommodation_required && matchesSearch && matchesHost && matchesEvent && matchesAttribute;
        }
        return guest.rsvp_status === statusFilter && matchesSearch && matchesHost && matchesEvent && matchesAttribute;
      }

      return matchesSearch && matchesHost && matchesEvent && matchesAttribute;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else {
        const aCategory = a.attributes[0] || "";
        const bCategory = b.attributes[0] || "";
        return aCategory.localeCompare(bCategory);
      }
    });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="w-full sm:w-auto">
          <Select value={sortBy} onValueChange={(value: "name" | "category") => setSortBy(value)}>
            <SelectTrigger className="w-full sm:w-[180px] bg-white">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Sort by Name</SelectItem>
              <SelectItem value="category">Sort by Category</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          className="w-full sm:w-auto"
        >
          {viewMode === "grid" ? (
            <List className="h-4 w-4 mr-2" />
          ) : (
            <LayoutGrid className="h-4 w-4 mr-2" />
          )}
          {viewMode === "grid" ? "List View" : "Grid View"}
        </Button>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedGuests.map((guest) => (
            <GuestCard
              key={guest.id}
              guest={guest}
              host={hosts.find((h) => h.id === guest.host_id) || defaultHost}
              onDelete={onDeleteGuest}
              onUpdateStatus={onUpdateStatus}
            />
          ))}
        </div>
      ) : (
        <GuestList
          guests={filteredAndSortedGuests}
          hosts={hosts}
          defaultHost={defaultHost}
          onUpdateStatus={onUpdateStatus}
        />
      )}

      {filteredAndSortedGuests.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No guests found matching the current filters.</p>
        </div>
      )}
    </div>
  );
};