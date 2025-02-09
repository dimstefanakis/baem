import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  try {
    const { name, description, images, singlePrice, multiplePrice, productId } = await req.json()

    // Create the product in Stripe
    const stripeProduct = await stripe.products.create({
      name,
      description,
      images,
      metadata: {
        supabase_id: productId
      }
    })

    // Create single purchase price
    const singlePurchasePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: singlePrice,
      currency: 'usd',
      metadata: {
        type: 'single'
      }
    })

    // Create multiple purchase price
    const multiplePurchasePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: multiplePrice,
      currency: 'usd',
      metadata: {
        type: 'multiple'
      }
    })

    return NextResponse.json({
      stripeProductId: stripeProduct.id,
      stripeSinglePriceId: singlePurchasePrice.id,
      stripleMultiplePriceId: multiplePurchasePrice.id
    })
  } catch (error) {
    console.error('Error creating Stripe product:', error)
    return NextResponse.json({ error: 'Failed to create Stripe product' }, { status: 500 })
  }
} 