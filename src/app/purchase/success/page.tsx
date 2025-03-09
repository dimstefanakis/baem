import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

export default async function SuccessPage({
  searchParams
}: {
  searchParams: Promise<{ id: string }>
}) {
  const supabase = await createClient();
  const id = (await searchParams).id;

  // Get the purchase with product details
  const { data: purchase } = await supabase
    .from('purchases')
    .select(`
      *,
      products (*)
    `)
    .eq('id', id)
    .single();

  if (!purchase) {
    redirect('/');
  }

  // Check if this is a completed purchase
  // We should verify that the purchase has stripe_session_id which indicates payment processing
  const isPaid = !!purchase.stripe_session_id;

  if (!isPaid) {
    return (
      <div className="max-w-4xl mx-auto p-8 font-lusitana tracking-tight">
        <h1 className="text-3xl font-bold mb-8">Payment Processing</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="mb-4">
            We&apos;re currently processing your payment. This may take a moment to complete.
          </p>
          <p className="text-sm text-gray-600">
            You&apos;ll be able to download your files once payment is confirmed.
          </p>
        </div>
      </div>
    );
  }

  // Only generate download URL if payment is confirmed
  // Calculate expiry seconds based on expires_at timestamp or use default
  let expirySeconds = 60 * 60; // Default 1 hour fallback
  
  if (purchase.expires_at) {
    const expiryDate = new Date(purchase.expires_at);
    const currentDate = new Date();
    
    // Calculate seconds difference between now and expiry
    const secondsDifference = Math.floor((expiryDate.getTime() - currentDate.getTime()) / 1000);
    
    // Only use expires_at if it's in the future
    if (secondsDifference > 0) {
      expirySeconds = secondsDifference;
    }
  }

  const { data, error } = await supabase
    .storage
    .from('purchased-designs')
    .createSignedUrl(`${purchase.product_id}/design.zip`, expirySeconds);

  if (error) {
    console.error('Error generating signed URL:', error);
  }

  return (
    <div className="max-w-4xl mx-auto p-8 font-lusitana tracking-tight">
      <h1 className="text-3xl font-bold mb-8">Thank you for your purchase!</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl mb-4">Download your design</h2>
        {data?.signedUrl ? (
          <>
            <a
              href={data.signedUrl}
              className="bg-black cursor-pointer text-white px-6 py-2 rounded hover:bg-gray-800"
              download
            >
              Download Tattoo Design
            </a>
            <p className="mt-4 text-sm text-gray-600">
              {purchase.expires_at
                ? `This link will expire on ${new Date(purchase.expires_at).toLocaleDateString()}`
                : 'You can access these files at any time'}
            </p>
          </>
        ) : (
          <p className="text-amber-600">
            We&apos;re preparing your download. Please check back in a few minutes.
          </p>
        )}
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl mb-4">Order Details</h2>
        <div className="space-y-2">
          <p><span className="font-semibold">Product:</span> {purchase.products?.name}</p>
          <p><span className="font-semibold">Purchase Type:</span> {purchase.purchase_type === 'single' ? 'Exclusive Rights' : 'Standard'}</p>
          <p><span className="font-semibold">Amount Paid:</span> ${(purchase.amount_paid / 100).toFixed(2)}</p>
          <p><span className="font-semibold">Purchase Date:</span> {new Date(purchase.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
} 