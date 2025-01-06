import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddHostFormProps {
  onSubmit: (host: { name: string; email: string; phone: string; avatar_url: string; side: "bride" | "groom" }) => void;
}

export const AddHostForm = ({ onSubmit }: AddHostFormProps) => {
  const [uploading, setUploading] = useState(false);
  const [newHost, setNewHost] = useState({
    name: "",
    email: "",
    phone: "",
    avatar_url: "",
    side: "bride" as "bride" | "groom",
  });
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
    onSubmit(newHost);
    setNewHost({ name: "", email: "", phone: "", avatar_url: "", side: "bride" });
  };

  return (
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
      <div>
        <Label htmlFor="side">Side</Label>
        <Select 
          value={newHost.side} 
          onValueChange={(value: "bride" | "groom") => setNewHost({ ...newHost, side: value })}
        >
          <SelectTrigger className="bg-white/50">
            <SelectValue placeholder="Select side" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bride">Bride</SelectItem>
            <SelectItem value="groom">Groom</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full" disabled={uploading}>
        {uploading ? "Uploading..." : "Add Host"}
      </Button>
    </form>
  );
};