import { Guest } from "@/types/guest";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

interface GuestAccommodationProps {
  guest: Guest;
}

export const GuestAccommodation = ({ guest }: GuestAccommodationProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleAccommodationChange = async (checked: boolean) => {
    try {
      const { error } = await supabase
        .from('guests')
        .update({ 
          accommodation_required: checked,
          accommodation_count: checked ? (guest.plus_count + 1) : 0
        })
        .eq('id', guest.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['guests'] });
      toast({
        title: "Updated",
        description: `Accommodation requirement ${checked ? 'added' : 'removed'}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update accommodation requirement.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={`accommodation-${guest.id}`}
        checked={guest.accommodation_required}
        onCheckedChange={handleAccommodationChange}
      />
      <label
        htmlFor={`accommodation-${guest.id}`}
        className="text-sm text-gray-700"
      >
        Accommodation Required
      </label>
    </div>
  );
};
