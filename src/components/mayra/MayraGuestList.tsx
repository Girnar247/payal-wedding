import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, X } from "lucide-react";

interface MayraGuest {
  id: string;
  name: string;
  relation: string;
  gift: string;
  status: "pending" | "confirmed" | "declined";
}

export const MayraGuestList = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGuest, setEditingGuest] = useState<MayraGuest | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    relation: "",
    gift: "",
  });
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: guests = [], isLoading } = useQuery({
    queryKey: ["mayra_guests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mayra_guests")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as MayraGuest[];
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingGuest) {
        const { error } = await supabase
          .from("mayra_guests")
          .update(formData)
          .eq("id", editingGuest.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Guest updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("mayra_guests")
          .insert([formData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Guest added successfully",
        });
      }

      setFormData({ name: "", relation: "", gift: "" });
      setShowAddForm(false);
      setEditingGuest(null);
      queryClient.invalidateQueries({ queryKey: ["mayra_guests"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save guest",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("mayra_guests")
        .delete()
        .eq("id", id);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["mayra_guests"] });
      toast({
        title: "Success",
        description: "Guest deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete guest",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = async (id: string, status: "confirmed" | "declined" | "pending") => {
    try {
      const { error } = await supabase
        .from("mayra_guests")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["mayra_guests"] });
      toast({
        title: "Success",
        description: "Status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-playfair text-wedding-text">Guest List</h2>
        <Button onClick={() => setShowAddForm(true)} disabled={showAddForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Guest
        </Button>
      </div>

      {(showAddForm || editingGuest) && (
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              placeholder="Relation"
              value={formData.relation}
              onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
            />
            <Input
              placeholder="Gift"
              value={formData.gift}
              onChange={(e) => setFormData({ ...formData, gift: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingGuest(null);
                  setFormData({ name: "", relation: "", gift: "" });
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingGuest ? "Update" : "Add"} Guest
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {guests.map((guest) => (
          <Card key={guest.id} className="p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{guest.name}</h3>
                {guest.relation && (
                  <p className="text-sm text-gray-600">{guest.relation}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditingGuest(guest);
                    setFormData({
                      name: guest.name,
                      relation: guest.relation || "",
                      gift: guest.gift || "",
                    });
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(guest.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>

            {guest.gift && (
              <p className="text-sm">
                <span className="font-medium">Gift:</span> {guest.gift}
              </p>
            )}

            <div className="flex justify-between items-center">
              <Badge
                variant={
                  guest.status === "confirmed"
                    ? "default"
                    : guest.status === "declined"
                    ? "destructive"
                    : "secondary"
                }
              >
                {guest.status}
              </Badge>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={guest.status === "confirmed" ? "default" : "outline"}
                  onClick={() => handleStatusUpdate(guest.id, "confirmed")}
                >
                  Confirm
                </Button>
                <Button
                  size="sm"
                  variant={guest.status === "declined" ? "destructive" : "outline"}
                  onClick={() => handleStatusUpdate(guest.id, "declined")}
                >
                  Decline
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};