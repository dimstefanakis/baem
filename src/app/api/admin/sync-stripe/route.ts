import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST() {
  const supabase = createClient()
  
  try {
    // Get all products from Stripe
    const stripeProducts = await stripe.products.list()
    const stripePrices = await stripe.prices.list()

    // Update local products with Stripe IDs
    for (const product of stripeProducts.data) {
      const prices = stripePrices.data.filter(p => p.product === product.id)
      
      await supabase
        .from('products')
        .update({
          stripe_product_id: product.id,
          stripe_price_id: prices[0]?.id
        })
        .eq('name', product.name)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error syncing with Stripe:', error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
} 