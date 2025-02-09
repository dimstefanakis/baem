import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const headersList = await headers();
  const supabase = createClient();
  try {
    const body = await req.text();
    const signature = headersList.get('stripe-signature')!;
    
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const { productId, purchaseType } = session.metadata as { 
        productId: string;
        purchaseType: 'single' | 'multiple';
      };

      // Update purchase record with successful payment
      await supabase
        .from('purchases')
        .update({ 
          stripe_session_id: session.id,
          expires_at: purchaseType === 'multiple' ? null : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days expiry for single purchases
        })
        .eq('stripe_session_id', session.id);

      // If single purchase, mark product as unavailable
      if (purchaseType === 'single') {
        await supabase
          .from('products')
          .update({ is_single_purchase_available: false })
          .eq('id', productId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
} 