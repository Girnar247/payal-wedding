import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set");
    return new Response(
      JSON.stringify({ error: "Email service configuration is missing" }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }

  try {
    const { guestId, hostEmail } = await req.json();
    console.log("Processing invitation for guestId:", guestId);

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch guest details
    const { data: guest, error: guestError } = await supabaseClient
      .from("guests")
      .select("*, hosts(*)")
      .eq("id", guestId)
      .single();

    if (guestError || !guest) {
      console.error("Error fetching guest:", guestError);
      throw new Error("Failed to fetch guest details");
    }

    if (!guest.email) {
      throw new Error("Guest email is required");
    }

    // Send email using Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `Wedding Invitation <${hostEmail}>`,
        to: [guest.email],
        subject: "You're Invited to Our Wedding!",
        html: `
          <div style="text-align: center; font-family: Arial, sans-serif;">
            <h1>Wedding Invitation</h1>
            <p>Dear ${guest.name},</p>
            <p>You are cordially invited to our wedding celebration!</p>
            <img src="https://vztjldlvnklafclbinnv.supabase.co/storage/v1/object/public/avatars/invitation-card.png" 
                 alt="Wedding Invitation" 
                 style="max-width: 600px; width: 100%;" />
            <p>Please RSVP at your earliest convenience.</p>
          </div>
        `,
      }),
    });

    const responseData = await res.json();
    console.log("Resend API response:", responseData);

    if (!res.ok) {
      console.error("Resend API error:", responseData);
      throw new Error(`Failed to send email: ${JSON.stringify(responseData)}`);
    }

    // Update guest invitation status
    const { error: updateError } = await supabaseClient
      .from("guests")
      .update({ invitation_sent: true })
      .eq("id", guestId);

    if (updateError) {
      console.error("Error updating guest:", updateError);
      throw new Error("Failed to update guest status");
    }

    return new Response(
      JSON.stringify({ success: true, data: responseData }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );

  } catch (error) {
    console.error("Error in send-invitation function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error instanceof Error ? error.stack : undefined
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});