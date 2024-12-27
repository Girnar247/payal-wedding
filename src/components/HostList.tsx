import { useState } from "react";
import { Host } from "@/types/guest";
import { Card } from "./ui/card";
import { User, Phone, Mail, Plus, Trash2, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { supabase } from "@/lib/supabase";

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
    avatar_url: "",
  });
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('host-avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('host-avatars')
        .getPublicUrl(filePath);

      setNewHost({ ...newHost, avatar_url: data.publicUrl });
      toast({
        title: "Success",
        description: "Avatar uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error uploading avatar",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddHost) {
      onAddHost(newHost);
      setNewHost({ name: "", email: "", phone: "", avatar_url: "" });
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
            <Label htmlFor="avatar">Avatar</Label>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={uploading}
              className="bg-white/50"
            />
          </div>
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
          <Button type="submit" className="w-full" disabled={uploading}>
            {uploading ? "Uploading..." : "Add Host"}
          </Button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hosts.map((host) => (
          <Card 
            key={host.id} 
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
                    onClick={() => handleDelete(host)}
                    className="hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};