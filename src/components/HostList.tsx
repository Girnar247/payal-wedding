import { Host } from "@/types/guest";
import { Card } from "./ui/card";
import { User, Phone, Mail } from "lucide-react";

interface HostListProps {
  hosts: Host[];
}

export const HostList = ({ hosts }: HostListProps) => {
  return (
    <Card className="p-6 glass-card">
      <h2 className="text-2xl font-playfair mb-4">Event Hosts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hosts.map((host) => (
          <Card key={host.id} className="p-4 bg-white/50">
            <div className="flex items-start space-x-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <p className="font-medium">{host.name}</p>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Mail className="h-4 w-4" />
                  <p className="text-sm text-gray-600">{host.email}</p>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Phone className="h-4 w-4" />
                  <p className="text-sm text-gray-600">{host.phone}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};