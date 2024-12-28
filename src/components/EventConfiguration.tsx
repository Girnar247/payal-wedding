import { useState } from "react";
import { EventCalendar } from "./EventCalendar";
import { HostList } from "./HostList";
import { EventType, EventDetails, Host } from "@/types/guest";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

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
    <Card className="p-6 space-y-8 glass-card">
      <h2 className="text-2xl font-playfair">Event Configuration</h2>
      
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

      <div className="flex justify-end">
        <Button onClick={onComplete} className="bg-wedding-rose hover:bg-wedding-rose/90">
          Complete Setup
        </Button>
      </div>
    </Card>
  );
};