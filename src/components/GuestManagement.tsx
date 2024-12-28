import { useState, useCallback, memo, Suspense, lazy } from "react";
import { Guest, Host } from "@/types/guest";
import { ViewToggle } from "./guest-management/ViewToggle";
import { Skeleton } from "./ui/skeleton";

// Lazy load components
const GuestCard = lazy(() => import("@/components/GuestCard"));
const GuestList = lazy(() => import("@/components/GuestList"));

interface GuestManagementProps {
  guests: Guest[];
  hosts: Host[];
  defaultHost: Host;
  onDeleteGuest: (id: string) => void;
  onUpdateStatus: (id: string, status: "confirmed" | "declined") => void;
}

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3].map((i) => (
      <Skeleton key={i} className="h-48 rounded-lg" />
    ))}
  </div>
);

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

      <Suspense fallback={<LoadingSkeleton />}>
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
      </Suspense>

      {guests.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No guests added yet. Click the button above to add your first guest.</p>
        </div>
      )}
    </div>
  );
};

export const GuestManagement = memo(GuestManagementComponent);