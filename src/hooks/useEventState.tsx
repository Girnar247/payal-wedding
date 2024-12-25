import { EventType, EventDetails } from "@/types/guest";
import { useLocalStorage } from "./useLocalStorage";

export const useEventState = () => {
  const [eventDetails, setEventDetails] = useLocalStorage<Record<EventType, EventDetails>>("eventDetails", {
    haldi: {
      date: new Date(2024, 5, 1),
      time: "10:00 AM",
      venue: "Residence Garden",
    },
    mehndi: {
      date: new Date(2024, 5, 2),
      time: "11:00 AM",
      venue: "Banquet Hall",
    },
    mayra: {
      date: new Date(2024, 5, 2),
      time: "5:00 PM",
      venue: "Family Temple",
    },
    sangeet: {
      date: new Date(2024, 5, 3),
      time: "7:00 PM",
      venue: "Grand Ballroom",
    },
    wedding: {
      date: new Date(2024, 5, 4),
      time: "7:00 PM",
      venue: "Royal Palace Gardens",
    },
  });

  return { eventDetails, setEventDetails };
};