# Stripe Integration Documentation

> **Last Updated:** December 5, 2024  
> **Purpose:** Complete documentation of Stripe payment integration for the Secure Checkout page

---

## Overview

This document details the complete Stripe integration implemented for the secure checkout page (`/secure-checkout`). This integration handles payments for website design tools and add-on services.

---

## Files Created/Modified

### 1. Edge Functions

#### `supabase/functions/create-checkout/index.ts`
**Purpose:** Creates Stripe Checkout sessions for secure payment processing.

```typescript
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
```

**Request Body:**
```json
{
  "productId": "string",
  "productName": "string", 
  "price": "string (e.g., '15.00')",
  "customerEmail": "string (optional)",
  "customerName": "string (optional)",
  "successUrl": "string (optional)",
  "cancelUrl": "string (optional)"
}
```

**Response:**
```json
{
  "sessionId": "cs_live_...",
  "url": "https://checkout.stripe.com/..."
}
```

---

#### `supabase/functions/stripe-webhook/index.ts`
**Purpose:** Handles Stripe webhook events, specifically `checkout.session.completed`.

```typescript
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event: Stripe.Event;

    // If webhook secret is configured, verify the signature
    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err: unknown) {
        const errMessage = err instanceof Error ? err.message : "Unknown error";
        console.error("Webhook signature verification failed:", errMessage);
        return new Response(
          JSON.stringify({ error: "Webhook signature verification failed" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else {
      // For testing without webhook secret
      event = JSON.parse(body);
    }

    console.log("Received Stripe event:", event.type);

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log("Checkout session completed:", {
        sessionId: session.id,
        customerEmail: session.customer_email,
        amountTotal: session.amount_total,
        metadata: session.metadata,
      });

      // Initialize Supabase client if needed to store orders
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // You can create an orders table and insert records here
        // For now, just log the successful payment
        console.log("Payment successful for:", {
          email: session.customer_email,
          amount: (session.amount_total || 0) / 100,
          product: session.metadata?.productName,
          customerId: session.customer,
        });
      }
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error("Webhook error:", error);
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
```

---

### 2. Frontend - SecureCheckoutPage.tsx

**File:** `src/pages/SecureCheckoutPage.tsx`

**Key Changes:**
1. Added Stripe.js library import
2. Added Stripe publishable key
3. Added `handleStripeCheckout` function
4. Added URL parameter handling for success/canceled states
5. Added loading state during checkout

**Stripe Publishable Key (LIVE):**
```typescript
const STRIPE_PUBLISHABLE_KEY = 'pk_live_51SXXh4HBw27Y92Ci4r7de3JTz13uAz7EF04b2ZpW8KhtDQYaa2mh1ayE8RiCKSRxRYtn3o7VNMINWJd9f7oGYsxT002VVUcvC8';
```

**Checkout Flow:**
1. User selects a product
2. User enters name and email
3. User clicks "Pay with Card"
4. Frontend calls `create-checkout` edge function
5. Edge function creates Stripe Checkout session
6. User is redirected to Stripe Checkout
7. After payment, user returns to `/secure-checkout?success=true` or `?canceled=true`
8. Stripe sends webhook to `stripe-webhook` edge function

---

## Required Secrets

### In Supabase Edge Functions

| Secret Name | Description | Where to Get |
|-------------|-------------|--------------|
| `STRIPE_SECRET_KEY` | Stripe secret key (sk_live_... or sk_test_...) | Stripe Dashboard → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret (whsec_...) | Stripe Dashboard → Developers → Webhooks |

### Already Configured (Auto-provided by Supabase)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## Stripe Dashboard Setup

### 1. Webhook Configuration
**URL:** `https://[YOUR_PROJECT_ID].supabase.co/functions/v1/stripe-webhook`

**Events to listen for:**
- `checkout.session.completed`

### 2. Current Project Webhook URL
```
https://cnviokaxrrmgiaffrtgb.supabase.co/functions/v1/stripe-webhook
```

---

## Products on Secure Checkout Page

### Add-ons ($15 - $75)
| ID | Name | Price |
|----|------|-------|
| addon-stock-photos | Premium Stock Photo & Graphics Pack | $15.00 |
| addon-logo-branding | Custom Logo & Branding Kit | $30.00 |
| addon-social-media | Social Media Marketing Bundle | $50.00 |
| addon-maintenance | Website Maintenance & Support Plan - Annual | $75.00 |

### Web Development Services ($140 - $160)
| ID | Name | Price |
|----|------|-------|
| webdev-basic | Professional Website Page Design & Development | $140.00 |
| webdev-seo | Website Page Design + 1 Month SEO Optimization | $150.00 |
| webdev-premium | Website Page Design + 6 Months SEO Strategy | $160.00 |

---

## Deployment Commands (For External Supabase)

If deploying to a different Supabase project:

```bash
# Deploy edge functions
supabase functions deploy create-checkout
supabase functions deploy stripe-webhook

# Set secrets
supabase secrets set STRIPE_SECRET_KEY=sk_live_your_key_here
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

---

## Dependencies Added

```json
{
  "@stripe/stripe-js": "latest"
}
```

---

## Payment Methods Enabled

- Credit/Debit Cards (Visa, Mastercard, Amex, etc.)
- Apple Pay (when available)
- Google Pay (when available)
- Klarna (Buy Now Pay Later)

---

## Statement Descriptor

Payments will appear on customer statements as:
- **Description:** "PRO DIGITAL SERVICES"
- **Statement Descriptor:** "PRO DIGITAL SVC"

---

## Cash App Alternative

The checkout page also supports Cash App payments:
- **Cash App Tag:** `$starevan11`
- **Email for receipts:** `reloadedfiretvteam@gmail.com`

---

## Future Enhancements (Not Yet Implemented)

1. **Orders Table** - Create a database table to store completed orders
2. **Email Notifications** - Send confirmation emails on successful payment
3. **Webhook Secret Verification** - Add `STRIPE_WEBHOOK_SECRET` for signature verification
4. **Refund Handling** - Handle `charge.refunded` webhook events

---

## Testing

### Test Mode
Replace live keys with test keys:
- `pk_test_...` for publishable key
- `sk_test_...` for secret key

### Test Card Numbers
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **Requires Auth:** 4000 0025 0000 3155

---

## Contact

For questions about this integration, refer to:
- [Stripe Documentation](https://stripe.com/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
