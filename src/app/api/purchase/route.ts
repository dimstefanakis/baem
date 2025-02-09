import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { productId, purchaseType, userId } = await req.json();

    // Get product details
    const supabase = createClient();
    const { data: product } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if single purchase is available
    if (purchaseType === 'single' && !product.is_single_purchase_available) {
      return NextResponse.json(
        { error: 'Single purchase not available' },
        { status: 400 }
      );
    }

    const price = purchaseType === 'single' 
      ? product.stripe_single_price_id
      : product.stripe_multiple_price_id;

    const amountPaid = purchaseType === 'single' 
      ? product.single_purchase_price 
      : product.multiple_purchase_price;

    if (!price) {
      return NextResponse.json(
        { error: 'Invalid price' },
        { status: 400 }
      );
    }

    // Create purchase record
    const { data: purchase } = await supabase
      .from('purchases')
      .insert({
        product_id: productId,
        user_id: userId,
        purchase_type: purchaseType,
        amount_paid: amountPaid ?? 0
      })
      .select()
      .single();

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              images: [product.primary_image_url]
            },
            unit_amount: amountPaid ?? 0
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/purchase/success?id=${purchase?.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/purchase/cancel`,
      metadata: {
        productId,
        purchaseType,
        purchaseId: purchase?.id ?? ''
      }
    });

    if (session.url) {
      return NextResponse.json({ url: session.url })
    }

    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 