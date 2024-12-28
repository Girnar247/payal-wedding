import { Guest, Host, GuestFormData } from "@/types/guest";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useGuestState = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: guests = [] } = useQuery({
    queryKey: ['guests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Guest[];
    }
  });

  const { data: hosts = [] } = useQuery({
    queryKey: ['hosts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Host[];
    }
  });

  const addGuestMutation = useMutation({
    mutationFn: async (formData: GuestFormData) => {
      const { error } = await supabase
        .from('guests')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          plus_count: formData.plusCount,
          host_id: formData.hostId,
          events: formData.events,
          attributes: formData.attributes,
          rsvp_status: 'pending'
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      toast({
        title: "Guest Added",
        description: "The guest has been successfully added.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add guest: " + error.message,
        variant: "destructive",
      });
    }
  });

  const deleteGuestMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      toast({
        title: "Guest Deleted",
        description: "The guest has been removed from the list.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete guest: " + error.message,
        variant: "destructive",
      });
    }
  });

  // Update guest status mutation
  const updateGuestStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "confirmed" | "declined" }) => {
      const { error } = await supabase
        .from('guests')
        .update({ rsvp_status: status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      toast({
        title: "Status Updated",
        description: "The guest's RSVP status has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update status: " + error.message,
        variant: "destructive",
      });
    }
  });

  // Add host mutation
  const addHostMutation = useMutation({
    mutationFn: async (host: Omit<Host, "id">) => {
      const { error } = await supabase
        .from('hosts')
        .insert([host]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hosts'] });
      toast({
        title: "Host Added",
        description: "The host has been successfully added.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add host: " + error.message,
        variant: "destructive",
      });
    }
  });

  // Delete host mutation
  const deleteHostMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('hosts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hosts'] });
      toast({
        title: "Host Deleted",
        description: "The host has been removed from the list.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete host: " + error.message,
        variant: "destructive",
      });
    }
  });

  return {
    guests,
    hosts,
    handleAddGuest: (data: GuestFormData) => addGuestMutation.mutate(data),
    handleDeleteGuest: (id: string) => deleteGuestMutation.mutate(id),
    handleUpdateStatus: (id: string, status: "confirmed" | "declined") => 
      updateGuestStatusMutation.mutate({ id, status }),
    handleAddHost: (host: Omit<Host, "id">) => addHostMutation.mutate(host),
    handleDeleteHost: (id: string) => deleteHostMutation.mutate(id),
  };
};
