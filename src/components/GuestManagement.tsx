import { useState } from "react";
import { GuestCard } from "@/components/GuestCard";
import { GuestList } from "@/components/GuestList";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
import { Guest, Host } from "@/types/guest";
import { useToast } from "@/components/ui/use-toast";

interface GuestManagementProps {
  guests: Guest[];
  hosts: Host[];
  defaultHost: Host;
  onDeleteGuest: (id: string) => void;
  onUpdateStatus: (id: string, status: "confirmed" | "declined") => void;
}

export const GuestManagement = ({
  guests,
  hosts,
  defaultHost,
  onDeleteGuest,
  onUpdateStatus,
}: GuestManagementProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { toast } = useToast();

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
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
          {guests.map((guest) => (
            <GuestCard
              key={guest.id}
              guest={guest}
              host={hosts.find((h) => h.id === guest.host_id) || defaultHost}
              onEdit={() => {}}
              onDelete={onDeleteGuest}
              onUpdateStatus={onUpdateStatus}
            />
          ))}
        </div>
      ) : (
        <GuestList
          guests={guests}
          hosts={hosts}
          defaultHost={defaultHost}
          onUpdateStatus={onUpdateStatus}
        />
      )}

      {guests.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No guests added yet. Click the button above to add your first guest.</p>
        </div>
      )}
    </div>
  );
};