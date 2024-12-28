import { EventCalendar } from "@/components/EventCalendar";
import { EventSummary } from "@/components/EventSummary";
import { HostList } from "@/components/HostList";
import { Button } from "@/components/ui/button";
import { EventType, EventDetails, Host } from "@/types/guest";

interface EventConfigurationProps {
  eventDetails: Record<EventType, EventDetails>;
  hosts: Host[];
  onUpdateEvent: (eventType: EventType, details: EventDetails) => void;
  onAddHost: (host: Omit<Host, "id">) => void;
  onDeleteHost: (id: string) => void;
  onComplete: () => void;
}

export const EventConfiguration = ({
  eventDetails,
  hosts,
  onUpdateEvent,
  onAddHost,
  onDeleteHost,
  onComplete,
}: EventConfigurationProps) => {
  return (
    <div className="space-y-8">
      <EventCalendar
        events={eventDetails}
        onUpdateEvent={onUpdateEvent}
      />

      <HostList
        hosts={hosts}
        onAddHost={onAddHost}
        onDeleteHost={onDeleteHost}
        editable={true}
      />

      <div className="text-center">
        <Button
          onClick={onComplete}
          variant="outline"
          className="bg-white/50 hover:bg-white/80"
        >
          Start Adding Guests
        </Button>
      </div>
    </div>
  );
};