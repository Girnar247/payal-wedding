import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Guest, Host, EventType, GuestAttribute } from '@/types/guest';
import { toast } from '@/components/ui/use-toast';

export const useSupabase = () => {
  const queryClient = useQueryClient();

  const { data: guests = [], isLoading: isLoadingGuests } = useQuery({
    queryKey: ['guests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: 'Error fetching guests',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      return data as Guest[];
    },
  });

  const { data: hosts = [], isLoading: isLoadingHosts } = useQuery({
    queryKey: ['hosts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: 'Error fetching hosts',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      return data as Host[];
    },
  });

  const addGuest = useMutation({
    mutationFn: async (guest: Omit<Guest, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('guests')
        .insert([guest])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      toast({
        title: 'Guest Added',
        description: 'The guest has been successfully added.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error adding guest',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateGuestStatus = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: 'confirmed' | 'declined';
    }) => {
      const { data, error } = await supabase
        .from('guests')
        .update({ rsvpStatus: status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      toast({
        title: 'Status Updated',
        description: 'The guest status has been updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating status',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteGuest = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('guests').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      toast({
        title: 'Guest Deleted',
        description: 'The guest has been removed from the list.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting guest',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    guests,
    hosts,
    isLoadingGuests,
    isLoadingHosts,
    addGuest,
    updateGuestStatus,
    deleteGuest,
  };
};