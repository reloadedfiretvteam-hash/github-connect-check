import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Generate random credentials
function generateUsername(): string {
  const adjectives = ['Stream', 'Fire', 'Pro', 'Elite', 'Prime', 'Ultra', 'Max', 'Turbo'];
  const nouns = ['Viewer', 'User', 'Member', 'Streamer', 'Watcher', 'Fan', 'Star', 'Ace'];
  const randomNum = Math.floor(Math.random() * 9999) + 1000;
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj}${noun}${randomNum}`;
}

function generatePassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

interface EmailRequest {
  customerEmail: string;
  productName: string;
  amount: number;
  isFreeTrial?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customerEmail, productName, amount, isFreeTrial }: EmailRequest = await req.json();

    if (!customerEmail) {
      throw new Error("Customer email is required");
    }

    const username = generateUsername();
    const password = generatePassword();
    const portalUrl = "http://ky-tv.cc";
    const setupVideoUrl = "https://youtu.be/DYSOp6mUzDU";

    // First email: Welcome/Thank you
    const welcomeSubject = isFreeTrial 
      ? "Welcome to Your 36-Hour Free Trial - Stream Stick Pro"
      : "Thank You for Your Purchase - Stream Stick Pro";

    const welcomeHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #fff; border-radius: 16px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #f97316, #ef4444); padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { padding: 30px; }
          .highlight-box { background: rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; margin: 20px 0; }
          .portal-link { display: inline-block; background: linear-gradient(135deg, #f97316, #ef4444); color: #fff; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; margin: 10px 0; }
          .footer { background: #0f0f1a; padding: 20px; text-align: center; font-size: 12px; color: #888; }
          .credentials { background: #16213e; border-radius: 8px; padding: 15px; margin: 15px 0; }
          .credentials p { margin: 8px 0; }
          .label { color: #888; }
          .value { color: #3b82f6; font-weight: bold; font-family: monospace; font-size: 18px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔥 ${isFreeTrial ? 'Welcome to Your Free Trial!' : 'Thank You for Your Purchase!'}</h1>
          </div>
          <div class="content">
            <p>Hi there!</p>
            <p>${isFreeTrial 
              ? 'Your 36-hour free trial has been activated. Enjoy unlimited access to all our premium content!'
              : `Thank you for purchasing <strong>${productName}</strong>!`
            }</p>
            
            ${!isFreeTrial ? `<p><strong>Order Total:</strong> $${amount.toFixed(2)}</p>` : ''}
            
            <div class="highlight-box">
              <h3 style="margin-top: 0;">🎬 Access Your Content</h3>
              <p>Visit our streaming portal to start watching:</p>
              <a href="${portalUrl}" class="portal-link">Go to Streaming Portal →</a>
              <p style="margin-top: 15px; font-size: 14px; color: #888;">Portal URL: ${portalUrl}</p>
            </div>
            
            <p>Enjoy your streaming experience!</p>
            <p>- The Stream Stick Pro Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Stream Stick Pro. All rights reserved.</p>
            <p>Questions? Reply to this email for support.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Second email: Credentials with setup video
    const credentialsSubject = "Your Login Credentials & Setup Guide - Stream Stick Pro";
    
    const credentialsHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #fff; border-radius: 16px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #3b82f6, #06b6d4); padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { padding: 30px; }
          .credentials-box { background: #16213e; border: 2px solid #3b82f6; border-radius: 12px; padding: 25px; margin: 20px 0; }
          .credential-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
          .credential-row:last-child { border-bottom: none; }
          .credential-label { color: #888; font-size: 14px; }
          .credential-value { color: #3b82f6; font-weight: bold; font-family: 'Courier New', monospace; font-size: 18px; background: rgba(59,130,246,0.1); padding: 8px 15px; border-radius: 6px; }
          .video-box { background: rgba(239,68,68,0.1); border: 2px solid #ef4444; border-radius: 12px; padding: 25px; margin: 20px 0; text-align: center; }
          .video-link { display: inline-block; background: linear-gradient(135deg, #ef4444, #f97316); color: #fff; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; margin: 10px 0; font-size: 18px; }
          .footer { background: #0f0f1a; padding: 20px; text-align: center; font-size: 12px; color: #888; }
          .warning { background: rgba(251,191,36,0.1); border-left: 4px solid #fbbf24; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Your Login Credentials</h1>
          </div>
          <div class="content">
            <p>Here are your auto-generated login credentials for the streaming portal:</p>
            
            <div class="credentials-box">
              <div class="credential-row">
                <span class="credential-label">Username:</span>
                <span class="credential-value">${username}</span>
              </div>
              <div class="credential-row">
                <span class="credential-label">Password:</span>
                <span class="credential-value">${password}</span>
              </div>
              <div class="credential-row">
                <span class="credential-label">Portal URL:</span>
                <span class="credential-value">${portalUrl}</span>
              </div>
            </div>
            
            <div class="warning">
              <strong>⚠️ Important:</strong> Save these credentials somewhere safe. You'll need them to log in to the streaming portal.
            </div>
            
            <div class="video-box">
              <h3 style="margin-top: 0; color: #ef4444;">📺 Setup Video Guide</h3>
              <p>Watch our complete setup tutorial to get started:</p>
              <a href="${setupVideoUrl}" class="video-link">▶️ Watch Setup Video</a>
              <p style="margin-top: 15px; font-size: 14px; color: #888;">${setupVideoUrl}</p>
            </div>
            
            <p>If you have any questions, feel free to reach out!</p>
            <p>- The Stream Stick Pro Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Stream Stick Pro. All rights reserved.</p>
            <p>Questions? Reply to this email for support.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send both emails
    console.log("Sending welcome email to:", customerEmail);
    const welcomeResponse = await resend.emails.send({
      from: "Stream Stick Pro <onboarding@resend.dev>",
      to: [customerEmail],
      subject: welcomeSubject,
      html: welcomeHtml,
    });
    console.log("Welcome email sent:", welcomeResponse);

    // Small delay between emails
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log("Sending credentials email to:", customerEmail);
    const credentialsResponse = await resend.emails.send({
      from: "Stream Stick Pro <onboarding@resend.dev>",
      to: [customerEmail],
      subject: credentialsSubject,
      html: credentialsHtml,
    });
    console.log("Credentials email sent:", credentialsResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        username, 
        welcomeEmailId: welcomeResponse.data?.id,
        credentialsEmailId: credentialsResponse.data?.id 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Error in send-purchase-email function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
