import { Guest } from "@/types/guest";

export const useGuestStats = (guests: Guest[]) => {
  const totalGuests = guests.length;
  const totalWithPlusOnes = guests.reduce((acc, guest) => acc + 1 + (guest.plus_count || 0), 0);
  const confirmed = guests.reduce((acc, guest) => {
    if (guest.rsvp_status === "confirmed") {
      return acc + 1 + (guest.plus_count || 0);
    }
    return acc;
  }, 0);
  const declined = guests.filter((guest) => guest.rsvp_status === "declined").length;
  const pending = guests.filter((guest) => guest.rsvp_status === "pending").length;
  const accommodationRequired = guests.filter(
    (guest) => guest.rsvp_status === "confirmed" && guest.accommodation_required
  ).length;

  return {
    totalGuests,
    totalWithPlusOnes,
    confirmed,
    declined,
    pending,
    accommodationRequired,
  };
};