import { useState } from "react";
import { Host } from "@/types/guest";
import { Card } from "./ui/card";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { HostCard } from "./host-list/HostCard";
import { AddHostForm } from "./host-list/AddHostForm";

interface HostListProps {
  hosts: Host[];
  onAddHost?: (host: Omit<Host, "id">) => void;
  onDeleteHost?: (id: string) => void;
  editable?: boolean;
}

export const HostList = ({ 
  hosts, 
  onAddHost, 
  onDeleteHost,
  editable = false 
}: HostListProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (newHost: Omit<Host, "id">) => {
    if (onAddHost) {
      onAddHost(newHost);
      setShowAddForm(false);
      toast({
        title: "Host Added",
        description: `${newHost.name} has been added as a host.`,
      });
    }
  };

  const handleDelete = (host: Host) => {
    if (onDeleteHost) {
      onDeleteHost(host.id);
      toast({
        title: "Host Removed",
        description: `${host.name} has been removed from the host list.`,
      });
    }
  };

  return (
    <Card className="p-6 glass-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-playfair">Event Hosts</h2>
        {editable && (
          <Button
            variant="outline"
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-white/50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Host
          </Button>
        )}
      </div>

      {showAddForm && <AddHostForm onSubmit={handleSubmit} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hosts.map((host) => (
          <HostCard
            key={host.id}
            host={host}
            onDelete={handleDelete}
            editable={editable}
          />
        ))}
      </div>
    </Card>
  );
};