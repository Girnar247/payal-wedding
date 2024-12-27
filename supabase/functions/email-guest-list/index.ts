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
    const { hostId } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Fetch host details
    const { data: hostData, error: hostError } = await supabaseClient
      .from('hosts')
      .select('*')
      .eq('id', hostId)
      .single();

    if (hostError) throw hostError;

    // Fetch guests for this host
    const { data: guests, error: guestError } = await supabaseClient
      .from('guests')
      .select('*')
      .eq('host_id', hostId);

    if (guestError) throw guestError;

    // Format guest list for email
    const guestList = guests.map(guest => `
      Name: ${guest.name}
      Email: ${guest.email || 'N/A'}
      Phone: ${guest.phone || 'N/A'}
      Events: ${guest.events.join(', ')}
      Categories: ${guest.attributes.join(', ')}
      Additional Guests: ${guest.plus_count}
      RSVP Status: ${guest.rsvp_status}
    `).join('\n\n');

    // Send email using Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      },
      body: JSON.stringify({
        from: 'Payal Wedding <onboarding@resend.dev>',
        to: [hostData.email],
        subject: 'Your Guest List',
        html: `
          <h1>Your Guest List</h1>
          <pre>${guestList}</pre>
        `,
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to send email');
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});