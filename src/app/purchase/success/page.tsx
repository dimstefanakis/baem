import { createClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function SuccessPage({
  searchParams: { id }
}: {
  searchParams: { id: string }
}) {
  const supabase = await createClient();

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

  // Generate download URL
  const { data } = await supabase
    .storage
    .from('purchased-designs')
    .createSignedUrl(`${purchase.id}/design.zip`, 60 * 60); // 1 hour expiry

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Thank you for your purchase!</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl mb-4">Download your design</h2>
        <a
          href={data?.signedUrl}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          download
        >
          Download Files
        </a>
        <p className="mt-4 text-sm text-gray-600">
          {purchase.expires_at
            ? `This link will expire on ${new Date(purchase.expires_at).toLocaleDateString()}`
            : 'You can access these files at any time'}
        </p>
      </div>
    </div>
  );
} 