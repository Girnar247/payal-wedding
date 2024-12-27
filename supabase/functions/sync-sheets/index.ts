import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Fetch all guests
    const { data: guests, error: guestError } = await supabaseClient
      .from('guests')
      .select(`
        *,
        hosts (
          name
        )
      `);

    if (guestError) throw guestError;

    // Format data for spreadsheet
    const formattedData = guests.map(guest => ({
      name: guest.name,
      email: guest.email || 'N/A',
      phone: guest.phone || 'N/A',
      host: guest.hosts?.name || 'Unassigned',
      rsvp_status: guest.rsvp_status,
      plus_count: guest.plus_count,
      events: guest.events.join(', '),
      attributes: guest.attributes.join(', ')
    }));

    console.log('Formatted guest data:', formattedData);

    return new Response(
      JSON.stringify({ success: true, data: formattedData }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in sync-sheets function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});