export type EventType = "haldi" | "mehndi" | "mayra" | "sangeet" | "wedding";

export interface EventDetails {
  date: Date;
  time: string;
  venue: string;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  plusCount: number;
  rsvpStatus: "pending" | "confirmed" | "declined";
  hostId: string;
  arrivalDateTime?: Date;
  events: EventType[];
}

export interface Host {
  id: string;
  name: string;
  email: string;
  phone: string;
}