# Stripe Integration Documentation

> **Last Updated:** December 5, 2024  
> **Purpose:** Complete documentation of Stripe payment integration for the Secure Checkout page  
> **AI Assistant:** Claude (Anthropic) via Lovable.dev  
> **Project:** StreamerStickPro / Reloaded Fire TV

---

## Overview

This document details the complete Stripe integration implemented for the secure checkout page (`/secure-checkout`). This integration handles payments for website design tools and add-on services.

---

## Supabase Project Details

### Current Lovable Cloud Project
- **Project ID:** `cnviokaxrrmgiaffrtgb`
- **Supabase URL:** `https://cnviokaxrrmgiaffrtgb.supabase.co`
- **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNudmlva2F4cnJtZ2lhZmZydGdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4ODM4MjIsImV4cCI6MjA4MDQ1OTgyMn0.gSztko-ulDsGQIRbEkmRKaUiM8YY6daNMJ2RBRHMSZk`

### Original Supabase Project (User's External)
- **Project ID:** `emlqlmfzqsnqokrqvmcm`
- **Note:** Could not be connected due to Lovable Cloud platform limitations

---

## Secrets Configured in Supabase

### Secrets Added for Stripe Integration
| Secret Name | Value Pattern | Status |
|-------------|---------------|--------|
| `STRIPE_SECRET_KEY` | `sk_live_51SXXh4HBw27Y92Ci...` | ✅ Added |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | ⚠️ Optional (for signature verification) |

### Pre-existing Supabase Secrets (Auto-configured)
| Secret Name | Description |
|-------------|-------------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin service role key |
| `SUPABASE_DB_URL` | Direct database connection URL |

---

## Stripe Account Details

### API Keys (LIVE MODE)
- **Publishable Key:** `pk_live_51SXXh4HBw27Y92Ci4r7de3JTz13uAz7EF04b2ZpW8KhtDQYaa2mh1ayE8RiCKSRxRYtn3o7VNMINWJd9f7oGYsxT002VVUcvC8`
- **Secret Key:** `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`

### Webhook Configuration
- **Endpoint URL:** `https://cnviokaxrrmgiaffrtgb.supabase.co/functions/v1/stripe-webhook`
- **Events Listening:** `checkout.session.completed`
- **Status:** ✅ Configured by user on December 5, 2024

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

## Migration to External Supabase Project

If you need to migrate this integration to your original Supabase project (`emlqlmfzqsnqokrqvmcm`), follow these steps:

### Step 1: Copy Edge Functions
Copy these folders to your project:
- `supabase/functions/create-checkout/`
- `supabase/functions/stripe-webhook/`

### Step 2: Deploy Edge Functions
```bash
cd your-project-folder
supabase link --project-ref emlqlmfzqsnqokrqvmcm
supabase functions deploy create-checkout
supabase functions deploy stripe-webhook
```

### Step 3: Set Secrets in External Supabase
```bash
supabase secrets set STRIPE_SECRET_KEY=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
```

Or via Supabase Dashboard:
1. Go to Project Settings → Edge Functions → Secrets
2. Add `STRIPE_SECRET_KEY` with the secret key value

### Step 4: Update Stripe Webhook URL
In Stripe Dashboard → Developers → Webhooks:
- **Old URL:** `https://cnviokaxrrmgiaffrtgb.supabase.co/functions/v1/stripe-webhook`
- **New URL:** `https://emlqlmfzqsnqokrqvmcm.supabase.co/functions/v1/stripe-webhook`

### Step 5: Update Frontend Supabase Client
Update `src/integrations/supabase/client.ts` with your original project credentials.

---

## Storage Buckets

### Current Configuration
| Bucket Name | Public | Purpose |
|-------------|--------|---------|
| `images` | Yes | Product images and assets |

---

## Database Tables

### Current State
No custom tables have been created yet. The following are planned:

#### Orders Table (Recommended)
```sql
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent TEXT,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'completed',
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Admin-only access policy (no public access to orders)
CREATE POLICY "Service role can manage orders"
  ON public.orders
  FOR ALL
  USING (auth.role() = 'service_role');
```

---

## Complete File List

### Files Created
| File | Purpose |
|------|---------|
| `supabase/functions/create-checkout/index.ts` | Creates Stripe checkout sessions |
| `supabase/functions/stripe-webhook/index.ts` | Handles Stripe webhook events |
| `docs/STRIPE_INTEGRATION.md` | This documentation file |

### Files Modified
| File | Changes |
|------|---------|
| `src/pages/SecureCheckoutPage.tsx` | Added Stripe checkout integration, loading states, URL param handling |

### Dependencies Added
| Package | Version | Purpose |
|---------|---------|---------|
| `@stripe/stripe-js` | latest | Stripe.js client library |

---

## Session Timeline

### December 5, 2024
1. User provided Stripe live API keys
2. Added `STRIPE_SECRET_KEY` to Supabase secrets
3. Created `create-checkout` edge function
4. Created `stripe-webhook` edge function
5. Modified `SecureCheckoutPage.tsx` with real Stripe integration
6. Deployed both edge functions
7. User configured webhook URL in Stripe Dashboard
8. Created this documentation

---

## Troubleshooting

### Common Issues

**"STRIPE_SECRET_KEY not configured" error**
- Ensure the secret is added in Supabase Dashboard → Settings → Edge Functions → Secrets

**Webhook not receiving events**
- Verify webhook URL is correct in Stripe Dashboard
- Check Stripe Dashboard → Developers → Webhooks → Recent events for delivery status

**CORS errors**
- Edge functions include CORS headers - should work from any origin

**Payment successful but no redirect**
- Check browser console for JavaScript errors
- Verify success/cancel URLs are correct

---

## Contact & Support

- **Project Email:** reloadedfiretvteam@gmail.com
- **Cash App:** $starevan11
- **Stripe Documentation:** https://stripe.com/docs
- **Supabase Documentation:** https://supabase.com/docs
