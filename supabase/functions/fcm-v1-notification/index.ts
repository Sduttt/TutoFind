import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"
import { JWT } from 'npm:google-auth-library@9'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';


const FIREBASE_SERVICE_ACCOUNT_STR = Deno.env.get('FIREBASE_SERVICE_ACCOUNT');
Deno.serve(async (req) => {
  try {
    // 1. Read the new message data sent by the Webhook
    const payload = await req.json();
    const record = payload.record;
    if (!record || !record.receiver_id) {
      return new Response("No receiver ID found", { status: 400 });
    }
    if (!FIREBASE_SERVICE_ACCOUNT_STR) {
      return new Response("Firebase Service Account not set", { status: 500 });
    }
  
    const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT_STR);

    const getAccessToken = () => {
      return new Promise((resolve, reject) => {
        const jwtClient = new JWT({
          email: serviceAccount.client_email,
          key: serviceAccount.private_key.replace(/\\n/g, '\n'), // Fixes newlines
          scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
        });
        jwtClient.authorize((err, tokens) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(tokens.access_token);
        });
      });
    };

    const accessToken = await getAccessToken();
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: receiverProfile } = await supabase
      .from('profiles')
      .select('fcm_token')
      .eq('id', record.receiver_id)
      .single();
    if (!receiverProfile || !receiverProfile.fcm_token) {
      console.log("No FCM token found for user.");
      return new Response("User has no token, skipped.", { status: 200 });
    }


    const { data: senderProfile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', record.sender_id)
      .single();
    const senderName = senderProfile?.full_name || 'New Message';


    const fcmEndpoint = `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`;
    const fcmResponse = await fetch(fcmEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`, // Secure Token!
      },
      // Send as data-only payload so client controls notification rendering
      body: JSON.stringify({
        message: {
          token: receiverProfile.fcm_token,
          data: {
            title: senderName,
            body: record.content,
            conversationId: String(record.conversation_id ?? ''),
          },
        },
      }),
    });

    const result = await fcmResponse.json();
    return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } });
  } catch (error: any) {
    console.error('Error serving request:', error);
    return new Response(String(error?.message ?? error), { status: 500 });
  }
});