import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export const useGoogleSheets = () => {
  const syncToSheets = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('sync-sheets', {
        body: {},
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Sync Complete',
        description: 'Guest list has been synced to Google Sheets',
      });
    },
    onError: (error) => {
      toast({
        title: 'Sync Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return { syncToSheets };
};