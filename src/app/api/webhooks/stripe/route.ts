import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase-admin";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const headersList = await headers();
  const supabase = await createClient();
  try {
    const body = await req.text();
    const signature = headersList.get("stripe-signature")!;

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret,
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const { productId, purchaseType } = session.metadata as {
        productId: string;
        purchaseType: "single" | "multiple";
      };

      // Update purchase record with successful payment
      const { data, error } = await supabase
        .from("purchases")
        .update({
          stripe_session_id: session.id,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString(),
        })
        .eq("stripe_session_id", session.id);

      if (error) {
        console.error("Error updating purchase record:", error);
        return NextResponse.json(
          { error: "Error updating purchase record", details: error },
          {
            status: 500,
          },
        );
      }

      // If single purchase, mark product as unavailable
      if (purchaseType === "single") {
        const { data: productData, error: productError } = await supabase
          .from("products")
          .update({ is_single_purchase_available: false })
          .eq("id", productId);

        if (productError) {
          console.error("Error updating product record:", productError);
          return NextResponse.json(
            { error: "Error updating product record", details: productError },
            {
              status: 500,
            },
          );
        }
      }
    }

    return NextResponse.json({ received: true, event: event.type });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 },
    );
  }
}
