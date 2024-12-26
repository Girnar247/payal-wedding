import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { google } from "https://deno.land/x/google_auth@v0.3.0/mod.ts";

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

    // Initialize Google Sheets
    const serviceAccountCreds = JSON.parse(Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY') ?? '');
    const spreadsheetId = Deno.env.get('GOOGLE_SHEET_ID');
    
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccountCreds,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });

    // Prepare data for Google Sheets
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Host',
      'RSVP Status',
      'Additional Guests',
      'Events',
      'Categories',
    ];

    const rows = guests.map((guest) => [
      guest.name,
      guest.email || 'N/A',
      guest.phone,
      guest.hosts?.name || 'Unassigned',
      guest.rsvpStatus,
      guest.plusCount.toString(),
      guest.events.join(', '),
      guest.attributes.join(', '),
    ]);

    // Update Google Sheet
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'A1:H' + (guests.length + 1),
      valueInputOption: 'RAW',
      requestBody: {
        values: [headers, ...rows],
      },
    });

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});