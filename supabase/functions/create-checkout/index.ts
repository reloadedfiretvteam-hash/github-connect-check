import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    const { productId, productName, price, customerEmail, customerName, successUrl, cancelUrl } = await req.json();

    if (!productId || !productName || !price) {
      throw new Error("Missing required fields: productId, productName, price");
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "klarna"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: productName,
              description: `Professional service: ${productName}`,
            },
            unit_amount: Math.round(parseFloat(price) * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl || `${req.headers.get("origin")}/secure-checkout?success=true`,
      cancel_url: cancelUrl || `${req.headers.get("origin")}/secure-checkout?canceled=true`,
      customer_email: customerEmail || undefined,
      metadata: {
        productId,
        productName,
        customerName: customerName || "",
      },
      payment_intent_data: {
        description: "PRO DIGITAL SERVICES",
        statement_descriptor: "PRO DIGITAL SVC",
      },
    });

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error("Error creating checkout session:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
