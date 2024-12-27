import { Host } from "@/types/guest";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Trash2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface HostCardProps {
  host: Host;
  onDelete?: (host: Host) => void;
  editable?: boolean;
}

export const HostCard = ({ host, onDelete, editable = false }: HostCardProps) => {
  return (
    <Card 
      className="relative p-6 overflow-hidden"
      style={{
        backgroundImage: host.avatar_url ? `url(${host.avatar_url})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"/>
      <div className="relative z-10 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-white">
              <AvatarImage src={host.avatar_url} alt={host.name} />
              <AvatarFallback>{host.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{host.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4" />
                <p className="text-sm">{host.email}</p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Phone className="h-4 w-4" />
                <p className="text-sm">{host.phone}</p>
              </div>
            </div>
          </div>
          {editable && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete?.(host)}
              className="hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};