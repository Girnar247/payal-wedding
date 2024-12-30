import { Button } from "@/components/ui/button";
import { DownloadGuestList } from "@/components/DownloadGuestList";
import { Guest, Host } from "@/types/guest";
import { AddGuestDialog } from "@/components/guest-card/AddGuestDialog";

interface GuestActionsProps {
  filteredGuests: Guest[];
  hosts: Host[];
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  resultCount?: number;
  onAddGuest: (data: any) => void;
}

export const GuestActions = ({
  filteredGuests,
  hosts,
  viewMode,
  setViewMode,
  resultCount,
  onAddGuest,
}: GuestActionsProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 w-full">
      <AddGuestDialog hosts={hosts} onSubmit={onAddGuest} />

      <div className="flex items-center gap-2 text-sm text-gray-600">
        {resultCount !== undefined && (
          <span>
            {resultCount} result{resultCount !== 1 ? 's' : ''}
          </span>
        )}
        <DownloadGuestList guests={filteredGuests} hosts={hosts} />
      </div>
    </div>
  );
};