import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Generate random credentials
function generateUsername(): string {
  const adjectives = ['Trial', 'Free', 'Demo', 'Test', 'Preview', 'Sample', 'Promo', 'Starter'];
  const nouns = ['Viewer', 'User', 'Member', 'Streamer', 'Watcher', 'Guest', 'Tester', 'Explorer'];
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

interface FreeTrialRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: FreeTrialRequest = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    const username = generateUsername();
    const password = generatePassword();
    const portalUrl = "http://ky-tv.cc";
    const setupVideoUrl = "https://youtu.be/DYSOp6mUzDU";

    console.log("Processing free trial for:", email);

    // Welcome email for free trial
    const welcomeHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #fff; border-radius: 16px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #10b981, #06b6d4); padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { padding: 30px; }
          .trial-badge { display: inline-block; background: linear-gradient(135deg, #10b981, #06b6d4); padding: 10px 25px; border-radius: 50px; font-weight: bold; font-size: 18px; margin: 15px 0; }
          .highlight-box { background: rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; margin: 20px 0; }
          .portal-link { display: inline-block; background: linear-gradient(135deg, #f97316, #ef4444); color: #fff; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; margin: 10px 0; }
          .footer { background: #0f0f1a; padding: 20px; text-align: center; font-size: 12px; color: #888; }
          .timer { background: #16213e; border: 2px solid #10b981; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; }
          .timer-text { font-size: 24px; font-weight: bold; color: #10b981; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Your 36-Hour Free Trial is Active!</h1>
          </div>
          <div class="content">
            <p>Welcome to Stream Stick Pro!</p>
            
            <div class="timer">
              <span class="trial-badge">36 HOUR FREE TRIAL</span>
              <p class="timer-text">⏰ Your trial starts now!</p>
              <p style="color: #888; font-size: 14px;">Enjoy unlimited access to all premium content</p>
            </div>
            
            <div class="highlight-box">
              <h3 style="margin-top: 0;">🎬 What You Get:</h3>
              <ul style="padding-left: 20px;">
                <li>18,000+ Live TV Channels</li>
                <li>60,000+ Movies & TV Shows</li>
                <li>All Sports & PPV Events</li>
                <li>4K/HD Quality Streaming</li>
                <li>Works on All Devices</li>
              </ul>
            </div>
            
            <div class="highlight-box">
              <h3 style="margin-top: 0;">🚀 Get Started</h3>
              <p>Visit our streaming portal to start watching:</p>
              <a href="${portalUrl}" class="portal-link">Go to Streaming Portal →</a>
              <p style="margin-top: 15px; font-size: 14px; color: #888;">Portal URL: ${portalUrl}</p>
            </div>
            
            <p>Enjoy your free trial!</p>
            <p>- The Stream Stick Pro Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Stream Stick Pro. All rights reserved.</p>
            <p>Love the service? Upgrade to a full subscription anytime!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Credentials email
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
            <h1>🔐 Your Trial Login Credentials</h1>
          </div>
          <div class="content">
            <p>Here are your auto-generated login credentials for your 36-hour free trial:</p>
            
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
              <strong>⚠️ Important:</strong> Your trial credentials are valid for 36 hours. Save them somewhere safe!
            </div>
            
            <div class="video-box">
              <h3 style="margin-top: 0; color: #ef4444;">📺 Setup Video Guide</h3>
              <p>Watch our complete setup tutorial to get started:</p>
              <a href="${setupVideoUrl}" class="video-link">▶️ Watch Setup Video</a>
              <p style="margin-top: 15px; font-size: 14px; color: #888;">${setupVideoUrl}</p>
            </div>
            
            <p>Enjoy your free trial! If you love the service, consider upgrading to a full subscription.</p>
            <p>- The Stream Stick Pro Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Stream Stick Pro. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send both emails
    console.log("Sending trial welcome email to:", email);
    const welcomeResponse = await resend.emails.send({
      from: "Stream Stick Pro <onboarding@resend.dev>",
      to: [email],
      subject: "🎉 Your 36-Hour Free Trial is Active! - Stream Stick Pro",
      html: welcomeHtml,
    });
    console.log("Trial welcome email sent:", welcomeResponse);

    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log("Sending trial credentials email to:", email);
    const credentialsResponse = await resend.emails.send({
      from: "Stream Stick Pro <onboarding@resend.dev>",
      to: [email],
      subject: "🔐 Your Trial Login Credentials - Stream Stick Pro",
      html: credentialsHtml,
    });
    console.log("Trial credentials email sent:", credentialsResponse);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Free trial activated! Check your email for login credentials.",
        username,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Error in free-trial function:", error);
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
