import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    return new Response(
      JSON.stringify({ error: 'Email service configuration is missing' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    const { hostId } = await req.json();
    console.log('Processing request for hostId:', hostId);

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch host details
    const { data: hostData, error: hostError } = await supabaseClient
      .from('hosts')
      .select('*')
      .eq('id', hostId)
      .single();

    if (hostError) {
      console.error('Error fetching host:', hostError);
      throw new Error('Failed to fetch host details');
    }

    if (!hostData || !hostData.email) {
      console.error('No host found or missing email:', hostData);
      throw new Error('Host not found or missing email');
    }

    // Fetch guests for this host
    const { data: guests, error: guestError } = await supabaseClient
      .from('guests')
      .select('*')
      .eq('host_id', hostId);

    if (guestError) {
      console.error('Error fetching guests:', guestError);
      throw new Error('Failed to fetch guest list');
    }

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

    console.log('Sending email to:', hostData.email);

    // Send email using Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
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

    const responseData = await res.json();
    console.log('Resend API response:', responseData);

    if (!res.ok) {
      console.error('Resend API error:', responseData);
      throw new Error(`Failed to send email: ${JSON.stringify(responseData)}`);
    }

    return new Response(
      JSON.stringify({ success: true, data: responseData }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in email-guest-list function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error instanceof Error ? error.stack : undefined
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});