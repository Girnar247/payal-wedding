import { Guest, Host } from "@/types/guest";
import { Button } from "./ui/button";
import { Download } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { toast } from "./ui/use-toast";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface DownloadGuestListProps {
  guests: Guest[];
  hosts: Host[];
}

export const DownloadGuestList = ({ guests, hosts }: DownloadGuestListProps) => {
  const downloadCSV = () => {
    const headers = ["Name", "Email", "Phone", "Host", "Events", "Attributes", "RSVP Status", "Plus Count", "Accommodation"];
    const rows = guests.map((guest) => {
      const host = hosts.find((h) => h.id === guest.host_id)?.name || "Unassigned";
      return [
        guest.name,
        guest.email || "",
        guest.phone || "",
        host,
        guest.events.join(", "),
        guest.attributes.join(", "),
        guest.rsvp_status,
        guest.plus_count,
        guest.accommodation_required ? "Yes" : "No"
      ];
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "guest-list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download Complete",
      description: "Guest list has been downloaded as CSV.",
    });
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text("Payal's Wedding - Guest List", 14, 15);
    doc.setFontSize(12);
    
    // Prepare the data
    const headers = [["Name", "Host", "Events", "RSVP", "+", "Accommodation"]];
    const data = guests.map((guest) => [
      guest.name,
      hosts.find((h) => h.id === guest.host_id)?.name || "Unassigned",
      guest.events.join(", "),
      guest.rsvp_status,
      guest.plus_count.toString(),
      guest.accommodation_required ? "Yes" : "No"
    ]);

    // Add the table
    (doc as any).autoTable({
      head: headers,
      body: data,
      startY: 25,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [128, 0, 128] },
    });

    // Save the PDF
    doc.save("guest-list.pdf");

    toast({
      title: "Download Complete",
      description: "Guest list has been downloaded as PDF.",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-white/50 hover:bg-white/80">
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={downloadCSV}>
          Download as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={downloadPDF}>
          Download as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};