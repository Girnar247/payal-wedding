import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import App from './App';
import './index.css';

// Configure QueryClient with optimized settings for initial render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      gcTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
      suspense: true, // Enable suspense mode for better loading states
    },
  },
});

// Prefetch critical data in parallel
Promise.all([
  queryClient.prefetchQuery({
    queryKey: ['guests'],
    queryFn: async () => {
      const { data } = await supabase.from('guests').select('*');
      return data;
    },
  }),
  queryClient.prefetchQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data } = await supabase.from('events').select('*');
      return data;
    },
  }),
]);

// Create root with error boundary
const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');

const root = createRoot(container);

// Render app with strict mode disabled in production for better performance
root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);