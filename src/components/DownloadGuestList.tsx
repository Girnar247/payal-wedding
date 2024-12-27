import { Button } from "./ui/button";
import { Download } from "lucide-react";
import { Guest, Host } from "@/types/guest";

interface DownloadGuestListProps {
  guests: Guest[];
  hosts: Host[];
}

export const DownloadGuestList = ({ guests, hosts }: DownloadGuestListProps) => {
  const downloadCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Categories",
      "Additional Guests",
      "Host",
      "Events",
      "RSVP Status",
    ];

    const rows = guests.map((guest) => {
      const host = hosts.find((h) => h.id === guest.host_id)?.name || "Unassigned";
      return [
        guest.name,
        guest.email || "",
        guest.phone,
        guest.attributes.join(", "),
        guest.plus_count,
        host,
        guest.events.join(", "),
        guest.rsvp_status,
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "guest_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      onClick={downloadCSV}
      variant="outline"
      className="bg-white/50 hover:bg-white/80"
    >
      <Download className="mr-2 h-4 w-4" />
      Download Guest List
    </Button>
  );
};