import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"
import Image from "next/image"
import { PurchaseButton } from "@/components/purchase-button"
import { formatPrice } from "@/lib/utils"
import { Lusitana } from "next/font/google"

const lusitana = Lusitana({
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: "--font-lusitana",
})

export default async function ProductPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) {
    redirect('/404')
  }

  const image = supabase.storage
    .from('product-images')
    .getPublicUrl(product.primary_image_url ?? "")

  return (
    <div className="min-h-screen relative font-lusitana tracking-tight">
      <div className="fixed inset-0 w-screen h-screen -z-10">
        <Image
          src="/bg.webp"
          alt="Background"
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>
      <div className="max-w-6xl mx-auto p-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left side - Images */}
          <div className="space-y-6">
            {/* Main image */}
            <div className="aspect-[3/4] relative shadow-md border-2 border-white shadow-inner [box-shadow:inset_0_2px_4px_rgba(0,0,0,0.4)] drop-shadow-md">
              <Image
                src={image.data.publicUrl}
                alt={product.name}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Additional images grid */}
            {product.additional_image_urls && (
              <div className="grid grid-cols-4 gap-2">
                {product.additional_image_urls.map((url, index) => (
                  <div key={index} className="aspect-square relative border border-gray-200 overflow-hidden bg-white">
                    <Image
                      src={url}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right side - Product info */}
          <div className="space-y-6">
            <h1 className="text-4xl font-lusitana tracking-tight">{product.name}</h1>
            <p className="text-gray-600 font-lusitana tracking-tight">{product.description}</p>

            <div className="space-y-6">
              {/* Exclusive Ownership Option */}
              {product.is_single_purchase_available && (
                <div className="border-2 p-6 bg-gradient-to-r from-neutral-50/50 to-stone-50/50 ">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold font-lusitana tracking-tight">Exclusive Design Ownership</h3>
                    <span className="bg-fuchsia-100 text-fuchsia-800 border-2 border-fuchsia-200 text-xs px-2 py-1 rounded-full">Recommended</span>
                  </div>
                  <p className="text-sm text-neutral-600 mb-3">Own this design exclusively - no one else can purchase it after you</p>
                  <div className="text-3xl font-bold text-neutral-900 mb-2">
                    {formatPrice((product.single_purchase_price ?? 0) / 100)}
                  </div>
                  <PurchaseButton
                    productId={product.id}
                    purchaseType="single"
                    className="w-[200px] rounded-none"
                    disabled={!product.is_single_purchase_available}
                  >
                    Buy Exclusive Rights
                  </PurchaseButton>
                </div>
              )}

              {/* Standard Purchase Option */}
              <div className="p-6 border-2 border-neutral-200 shadow-sm">
                <h3 className="text-xl font-semibold mb-2">Standard Purchase</h3>
                <p className="text-sm text-neutral-600 mb-3">Get the design at base price - others can also purchase this design</p>
                <div className="text-3xl font-bold text-neutral-900 mb-2">
                  {formatPrice((product.multiple_purchase_price ?? 0) / 100)}
                </div>
                <PurchaseButton
                  productId={product.id}
                  purchaseType="multiple"
                  className="w-[200px] bg-neutral-600 hover:bg-neutral-700 text-white rounded-none"
                >
                  Buy Standard
                </PurchaseButton>
              </div>
            </div>

            <div className="border-t-2 pt-6 mt-8 p-6">
              <h2 className="text-xl mb-4">Custom Requests</h2>
              <p className="text-gray-600 mb-4">
                If you like this design and want something similar, request a custom design!
              </p>
              <a 
                href={`mailto:monabaemtattoo@gmail.com?subject=Custom Tattoo Design Request&body=Hi, I'm interested in getting a custom tattoo design similar to "${product.name}".`}
                className="inline-block"
              >
                <Button variant="outline" className="w-full rounded-none w-[200px]">
                  Request Custom
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 