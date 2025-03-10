"use server";

import { createClient } from "@/lib/supabase-admin";
import { redirect } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function checkout(
  productId: string,
  purchaseType: "single" | "multiple",
  userId: string,
) {
  const supabase = await createClient();

  // Get product details
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (!product) {
    throw new Error("Product not found");
  }

  // Check if single purchase is available
  if (purchaseType === "single" && !product.is_single_purchase_available) {
    throw new Error("Single purchase not available");
  }

  const priceId = purchaseType === "single"
    ? product.stripe_single_price_id
    : product.stripe_multiple_price_id;

  if (!priceId) {
    throw new Error("Invalid price");
  }

  // Create purchase record
  const { data: purchase } = await supabase
    .from("purchases")
    .insert({
      product_id: productId,
      user_id: userId,
      purchase_type: purchaseType,
      amount_paid: purchaseType === "single"
        ? product.single_purchase_price ?? 0
        : product.multiple_purchase_price ?? 0,
    })
    .select()
    .single();

  if (!purchase) {
    throw new Error("Failed to create purchase record");
  }

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url:
      `${process.env.NEXT_PUBLIC_BASE_URL}/purchase/success?id=${purchase.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/i/${productId}`,
    metadata: {
      productId,
      purchaseType,
      purchaseId: purchase.id,
    },
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session");
  }

  // Update purchase with session ID
  const { data, error } = await supabase
    .from("purchases")
    .update({ stripe_session_id: session.id })
    .eq("id", purchase.id);

  console.log("data", data);
  console.log("id", purchase.id);
  console.log("session", session.id);
  if (error) {
    throw new Error("Failed to update purchase with session ID");
  }

  redirect(session.url);
}
