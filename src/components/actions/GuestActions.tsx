import { Button } from "@/components/ui/button";
import { PlusCircle, MinusCircle } from "lucide-react";
import { DownloadGuestList } from "@/components/DownloadGuestList";
import { Guest, Host } from "@/types/guest";

interface GuestActionsProps {
  showAddForm: boolean;
  setShowAddForm: (show: boolean) => void;
  filteredGuests: Guest[];
  hosts: Host[];
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

export const GuestActions = ({
  showAddForm,
  setShowAddForm,
  filteredGuests,
  hosts,
  viewMode,
  setViewMode,
}: GuestActionsProps) => {
  return (
    <div className="flex gap-2 w-full md:w-auto">
      <Button
        onClick={() => setShowAddForm(!showAddForm)}
        variant="outline"
        className="w-full md:w-auto bg-white/50 hover:bg-white/80"
      >
        {showAddForm ? (
          <>
            <MinusCircle className="mr-2 h-4 w-4" />
            Cancel
          </>
        ) : (
          <>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Guest
          </>
        )}
      </Button>

      <div className="flex items-center gap-2">
        <DownloadGuestList guests={filteredGuests} hosts={hosts} />
      </div>
    </div>
  );
};