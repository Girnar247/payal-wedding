import { useState } from "react";
import { Host } from "@/types/guest";
import { Card } from "./ui/card";
import { User, Phone, Mail, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";

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
  const [newHost, setNewHost] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddHost) {
      onAddHost(newHost);
      setNewHost({ name: "", email: "", phone: "" });
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

      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-white/50 p-4 rounded-lg">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newHost.name}
              onChange={(e) => setNewHost({ ...newHost, name: e.target.value })}
              required
              className="bg-white/50"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={newHost.email}
              onChange={(e) => setNewHost({ ...newHost, email: e.target.value })}
              required
              className="bg-white/50"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={newHost.phone}
              onChange={(e) => setNewHost({ ...newHost, phone: e.target.value })}
              required
              className="bg-white/50"
            />
          </div>
          <Button type="submit" className="w-full">Add Host</Button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hosts.map((host) => (
          <Card key={host.id} className="p-4 bg-white/50">
            <div className="flex items-start justify-between">
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
              {editable && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(host)}
                  className="hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};