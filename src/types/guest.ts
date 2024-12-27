export type EventType = "haldi" | "mehndi" | "mayra" | "sangeet" | "wedding";
export type GuestAttribute = "family" | "friends" | "staff" | "mohalla";

export interface EventDetails {
  date: Date | string;
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
  accommodation_required: boolean;
}

export interface Host {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at?: string;
  avatar_url?: string;
}

export interface GuestFormData {
  name: string;
  email?: string;
  phone: string;
  plusCount: number;
  hostId: string;
  events: EventType[];
  attributes: GuestAttribute[];
}