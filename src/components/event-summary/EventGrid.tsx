import { EventType, EventDetails, Guest } from "@/types/guest";
import { EventCard } from "./EventCard";
import { memo } from "react";

interface EventGridProps {
  sortedEvents: [string, EventDetails][];
  guests: Guest[];
  onBackgroundUpload: (event: React.ChangeEvent<HTMLInputElement>, eventType: string) => Promise<void>;
  uploading: string | null;
}

export const EventGrid = memo(function EventGrid({
  sortedEvents,
  guests,
  onBackgroundUpload,
  uploading,
}: EventGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {sortedEvents.map(([eventType, details]) => (
        <EventCard
          key={eventType}
          eventType={eventType as EventType}
          details={details}
          guests={guests}
          onBackgroundUpload={onBackgroundUpload}
          uploading={uploading}
        />
      ))}
    </div>
  );
});