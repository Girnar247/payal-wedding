import { useState, useCallback, memo } from "react";
import { GuestCard } from "@/components/GuestCard";
import { GuestList } from "@/components/GuestList";
import { Guest, Host } from "@/types/guest";
import { ViewToggle } from "./guest-management/ViewToggle";

interface GuestManagementProps {
  guests: Guest[];
  hosts: Host[];
  defaultHost: Host;
  onDeleteGuest: (id: string) => void;
  onUpdateStatus: (id: string, status: "confirmed" | "declined") => void;
}

const GuestManagementComponent = ({
  guests,
  hosts,
  defaultHost,
  onDeleteGuest,
  onUpdateStatus,
}: GuestManagementProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const toggleViewMode = useCallback(() => {
    setViewMode(prev => prev === "grid" ? "list" : "grid");
  }, []);

  const handleEdit = useCallback(() => {
    // Empty callback for now, can be implemented later if needed
  }, []);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <ViewToggle viewMode={viewMode} onToggle={toggleViewMode} />
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guests.map((guest) => (
            <GuestCard
              key={guest.id}
              guest={guest}
              host={hosts.find((h) => h.id === guest.host_id) || defaultHost}
              onEdit={handleEdit}
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

export const GuestManagement = memo(GuestManagementComponent);