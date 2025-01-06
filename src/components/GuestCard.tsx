import { Guest, Host } from "@/types/guest";
import { Card, CardContent, CardHeader } from "./ui/card";
import { GuestEditDialog } from "./guest-card/GuestEditDialog";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GuestHeader } from "./guest-card/GuestHeader";
import { GuestHostInfo } from "./guest-card/GuestHostInfo";
import { GuestEventBadges } from "./guest-card/GuestEventBadges";
import { GuestContactInfo } from "./guest-card/GuestContactInfo";
import { GuestRSVPStatus } from "./guest-card/GuestRSVPStatus";
import { GuestAccommodation } from "./guest-card/GuestAccommodation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { GuestActions } from "./guest-card/GuestActions";

interface GuestCardProps {
  guest: Guest;
  host: Host;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: "confirmed" | "declined" | "pending") => void;
}

export const GuestCard = ({ guest, host, onDelete, onUpdateStatus }: GuestCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedGuest, setEditedGuest] = useState(guest);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .update({
          name: editedGuest.name,
          host_id: editedGuest.host_id,
          plus_count: editedGuest.plus_count
        })
        .eq('id', guest.id)
        .select()
        .single();

      if (error) throw error;

      queryClient.setQueryData(['guests'], (oldData: Guest[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map(g => g.id === guest.id ? { ...g, ...data } : g);
      });

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Guest details updated successfully.",
      });

      await queryClient.invalidateQueries({ queryKey: ['guests'] });
    } catch (error) {
      console.error('Error updating guest:', error);
      toast({
        title: "Error",
        description: "Failed to update guest details.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="bg-white/50">
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-2 flex-grow">
                {isEditing ? (
                  <Input
                    value={editedGuest.name}
                    onChange={(e) => setEditedGuest({ ...editedGuest, name: e.target.value })}
                    className="font-semibold text-lg"
                  />
                ) : (
                  <h3 className="font-semibold text-lg" onClick={() => setIsEditing(true)}>
                    {guest.name}
                  </h3>
                )}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="capitalize">
                    {guest.attributes[0] || "Unassigned"}
                  </Badge>
                  {isEditing ? (
                    <Input
                      type="number"
                      min="0"
                      max="20"
                      value={editedGuest.plus_count}
                      onChange={(e) => setEditedGuest({ ...editedGuest, plus_count: parseInt(e.target.value) || 0 })}
                      className="w-20"
                    />
                  ) : (
                    guest.plus_count > 0 && (
                      <Badge variant="outline" className="bg-wedding-rose/20" onClick={() => setIsEditing(true)}>
                        +{guest.plus_count}
                      </Badge>
                    )
                  )}
                  <Badge 
                    variant="secondary"
                    className={`capitalize ${
                      guest.rsvp_status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      guest.rsvp_status === 'declined' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {guest.rsvp_status}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button size="sm" onClick={handleSave}>Save</Button>
                    <Button size="sm" variant="outline" onClick={() => {
                      setIsEditing(false);
                      setEditedGuest(guest);
                    }}>Cancel</Button>
                  </>
                ) : (
                  <GuestActions
                    guest={guest}
                    onDelete={onDelete}
                    onUpdateStatus={onUpdateStatus}
                  />
                )}
              </div>
            </div>
            {isEditing ? (
              <Select
                value={editedGuest.host_id}
                onValueChange={(value) => setEditedGuest({ ...editedGuest, host_id: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a host" />
                </SelectTrigger>
                <SelectContent>
                  {/* We'll get hosts from props */}
                  <SelectItem value={host.id}>
                    {host.name}
                  </SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="flex items-center gap-3" onClick={() => setIsEditing(true)}>
                <Avatar className="h-8 w-8 border border-gray-200">
                  <AvatarImage src={host.avatar_url} alt={host.name} />
                  <AvatarFallback>{host.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-gray-500">Host: {host.name}</p>
                </div>
              </div>
            )}
            <GuestContactInfo guest={guest} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <GuestEventBadges events={guest.events} />
          <GuestAccommodation guest={guest} />
        </CardContent>
      </Card>

      <GuestRSVPStatus guest={guest} onUpdateStatus={onUpdateStatus} />
    </>
  );
};