import { Guest, Host, GuestFormData } from "@/types/guest";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useGuestState = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: guests = [], isLoading: guestsLoading } = useQuery({
    queryKey: ['guests'],
    queryFn: async () => {
      console.log('Fetching guests...');
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching guests:', error);
        toast({
          title: "Error fetching guests",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      console.log('Fetched guests:', data);
      return data as Guest[];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    retry: 1, // Only retry once on failure
    refetchOnWindowFocus: false, // Disable automatic refetching on window focus
    initialData: [], // Provide initial data to prevent undefined states
  });

  const { data: hosts = [], isLoading: hostsLoading } = useQuery({
    queryKey: ['hosts'],
    queryFn: async () => {
      console.log('Fetching hosts...');
      const { data, error } = await supabase
        .from('hosts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching hosts:', error);
        toast({
          title: "Error fetching hosts",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      console.log('Fetched hosts:', data);
      return data as Host[];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    initialData: [],
  });

  const addGuestMutation = useMutation({
    mutationFn: async (formData: GuestFormData) => {
      console.log('Adding guest:', formData);
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

      if (error) {
        console.error('Error adding guest:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      toast({
        title: "Guest Added",
        description: "The guest has been successfully added.",
      });
    },
    onError: (error: Error) => {
      console.error('Error in addGuestMutation:', error);
      toast({
        title: "Error",
        description: "Failed to add guest: " + error.message,
        variant: "destructive",
      });
    }
  });

  const deleteGuestMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting guest:', id);
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting guest:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      toast({
        title: "Guest Deleted",
        description: "The guest has been removed from the list.",
      });
    },
    onError: (error: Error) => {
      console.error('Error in deleteGuestMutation:', error);
      toast({
        title: "Error",
        description: "Failed to delete guest: " + error.message,
        variant: "destructive",
      });
    }
  });

  const updateGuestStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "confirmed" | "declined" }) => {
      console.log('Updating guest status:', { id, status });
      const { error } = await supabase
        .from('guests')
        .update({ rsvp_status: status })
        .eq('id', id);

      if (error) {
        console.error('Error updating guest status:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      toast({
        title: "Status Updated",
        description: "The guest's RSVP status has been updated.",
      });
    },
    onError: (error: Error) => {
      console.error('Error in updateGuestStatusMutation:', error);
      toast({
        title: "Error",
        description: "Failed to update status: " + error.message,
        variant: "destructive",
      });
    }
  });

  // Add new mutations for host management
  const addHostMutation = useMutation({
    mutationFn: async (host: Omit<Host, "id">) => {
      console.log('Adding host:', host);
      const { error } = await supabase
        .from('hosts')
        .insert([host]);

      if (error) {
        console.error('Error adding host:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hosts'] });
      toast({
        title: "Host Added",
        description: "The host has been successfully added.",
      });
    },
    onError: (error: Error) => {
      console.error('Error in addHostMutation:', error);
      toast({
        title: "Error",
        description: "Failed to add host: " + error.message,
        variant: "destructive",
      });
    }
  });

  const deleteHostMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting host:', id);
      const { error } = await supabase
        .from('hosts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting host:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hosts'] });
      toast({
        title: "Host Deleted",
        description: "The host has been removed from the list.",
      });
    },
    onError: (error: Error) => {
      console.error('Error in deleteHostMutation:', error);
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
    guestsLoading,
    hostsLoading,
    handleAddGuest: (data: GuestFormData) => addGuestMutation.mutate(data),
    handleDeleteGuest: (id: string) => deleteGuestMutation.mutate(id),
    handleUpdateStatus: (id: string, status: "confirmed" | "declined") => 
      updateGuestStatusMutation.mutate({ id, status }),
    handleAddHost: (host: Omit<Host, "id">) => addHostMutation.mutate(host),
    handleDeleteHost: (id: string) => deleteHostMutation.mutate(id),
  };
};
