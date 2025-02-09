import { createClient } from "@/lib/supabase-server"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"
import Image from "next/image"
import { PurchaseButton } from "@/components/purchase-button"

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

  return (
    <div className="min-h-screen relative">
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
            <div className="aspect-square relative border border-gray-200 rounded-lg overflow-hidden bg-white">
              <Image
                src={product.primary_image_url}
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
                  <div key={index} className="aspect-square relative border border-gray-200 rounded-lg overflow-hidden bg-white">
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
            <h1 className="text-4xl">{product.name}</h1>

            <p className="text-gray-600">{product.description}</p>

            <div className="space-y-4">
              {product.is_single_purchase_available && (
                <div>
                  <div className="text-3xl">${(product.single_purchase_price ?? 0 / 100).toFixed(2)}</div>
                  <PurchaseButton
                    productId={product.id}
                    purchaseType="single"
                    className="w-full mt-2"
                  >
                    Buy Single Use
                  </PurchaseButton>
                </div>
              )}

              <div>
                <div className="text-3xl">${(product.multiple_purchase_price ?? 0 / 100).toFixed(2)}</div>
                <PurchaseButton
                  productId={product.id}
                  purchaseType="multiple"
                  className="w-full mt-2"
                >
                  Buy Multiple Use
                </PurchaseButton>
              </div>
            </div>

            {!product.is_single_purchase_available && (
              <div className="text-sm text-gray-500">
                Single purchase option is currently unavailable
              </div>
            )}

            <div className="border-t pt-6 mt-8">
              <h2 className="text-xl mb-4">Custom Requests</h2>
              <p className="text-gray-600 mb-4">
                If you like this design and want something similar, request a custom design!
              </p>
              <Button variant="outline" className="w-full">
                Request Custom
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 