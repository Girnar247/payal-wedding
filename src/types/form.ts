import { EventType, GuestAttribute, Host } from "./guest";

export interface GuestFormData {
  name: string;
  email?: string;
  phone: string;
  plusCount: number;
  hostId: string;
  events: EventType[];
  attributes: GuestAttribute[];
  side: "bride" | "groom";
}

export interface AddGuestFormProps {
  onSubmit: (data: GuestFormData) => void;
  hosts: Host[];
  side: "bride" | "groom";
}