export type EventType = "haldi" | "mehndi" | "mayra" | "sangeet" | "wedding";
export type GuestAttribute = "family" | "friends" | "staff";

export interface EventDetails {
  date: Date;
  time: string;
  venue: string;
}

export interface Guest {
  id: string;
  name: string;
  email?: string;
  phone: string;
  plus_count: number;
  rsvp_status: "pending" | "confirmed" | "declined";
  host_id: string;
  events: EventType[];
  attributes: GuestAttribute[];
  created_at?: string;
}

export interface Host {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at?: string;
}

// Frontend form data interface (camelCase)
export interface GuestFormData {
  name: string;
  email?: string;
  phone: string;
  plusCount: number;
  hostId: string;
  events: EventType[];
  attributes: GuestAttribute[];
}