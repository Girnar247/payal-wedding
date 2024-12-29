import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import App from './App';
import './index.css';

// Configure QueryClient with optimized settings for faster initial load
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      gcTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
      // Prefetch guest list data
      select: (data) => data,
    },
  },
});

// Prefetch critical data
queryClient.prefetchQuery({
  queryKey: ['guests'],
  queryFn: async () => {
    const { data } = await supabase.from('guests').select('*');
    return data;
  },
});

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);