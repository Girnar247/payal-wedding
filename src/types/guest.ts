export type EventType = "haldi" | "mehndi" | "mayra" | "sangeet" | "wedding";
export type GuestAttribute = "family" | "friends" | "staff" | "mohalla";
export type Side = "bride" | "groom";

export interface EventDetails {
  date: Date | string;
  time: string;
  venue: string;
  background_url?: string;
  main_background_url?: string;
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
  accommodation_count: number;
  invitation_sent: boolean;
  side: Side;
}

export interface Host {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at?: string;
  avatar_url?: string;
  side: Side;
  is_admin?: boolean;
  admin_password?: string;
  bride_side_password?: string;
  groom_side_password?: string;
}

export interface GuestFormData {
  name: string;
  email?: string;
  phone: string;
  plusCount: number;
  hostId: string;
  events: EventType[];
  attributes: GuestAttribute[];
  side?: Side;
}