import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import Image from "next/image";
import { PurchaseButton } from "@/components/purchase-button";
import { formatPrice } from "@/lib/utils";
import { Lusitana } from "next/font/google";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const lusitana = Lusitana({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-lusitana",
});

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const supabase = createClient();
  const { data: product } = await supabase.from("products").select("*").eq("id", id).single();
  return {
    title: product?.name ? `${product?.name} Tattoo` : "Mona Baem - Tattoo Designs",
    description: product?.description ?? "I'm Mona, a tattoo artist showcasing unique custom designs. Browse my portfolio, shop for original tattoo designs, and contact me for custom commission work.",
  };
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) {
    redirect("/404");
  }

  const images = [product.primary_image_url, ...(product.additional_image_urls || [])].filter(Boolean);

  return (
    <>
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
              <Carousel className="w-full">
                <CarouselContent>
                  {images.map((imageUrl, index) => {
                    const image = supabase.storage
                      .from("product-images")
                      .getPublicUrl(imageUrl);
                    return (
                      <CarouselItem key={index}>
                        <div className="p-1 h-full flex items-center justify-center">
                          <Image
                            src={image.data.publicUrl}
                            alt={`Product image ${index + 1}`}
                            width={500}
                            height={500}
                            priority={index === 0}
                            className="object-cover rounded-md aspect-[3/4]"
                          />
                        </div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                {images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-4 bg-transparent border-none" />
                    <CarouselNext className="right-4 bg-transparent border-none" />
                  </>
                )}
              </Carousel>
            </div>

            {/* Right side - Product info */}
            <div className="space-y-6">
              <h1 className="text-4xl font-lusitana tracking-tight">
                {product.name}
              </h1>
              <p className="text-gray-600 font-lusitana tracking-tight">
                {product.description}
              </p>

              <div className="space-y-6">
                {/* Exclusive Ownership Option */}
                {product.is_single_purchase_available && (
                  <div className="border-2 p-6 bg-gradient-to-r from-neutral-50/50 to-stone-50/50 ">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold font-lusitana tracking-tight">
                        Exclusive Design Ownership
                      </h3>
                      <span className="bg-fuchsia-100 text-fuchsia-800 border-2 border-fuchsia-200 text-xs px-2 py-1 rounded-full">
                        Recommended
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 mb-3">
                      Own this design exclusively - no one else can purchase it
                      after you
                    </p>
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
                  <h3 className="text-xl font-semibold mb-2">
                    Standard Purchase
                  </h3>
                  <p className="text-sm text-neutral-600 mb-3">
                    Get the design at base price - others can also purchase this
                    design
                  </p>
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
                  If you like this design and want something similar, request a
                  custom design by clicking the button below or emailing us at
                  monabaemtattoo@gmail.com!
                </p>
                <a
                  href={`mailto:monabaemtattoo@gmail.com?subject=Custom Tattoo Design Request&body=Hi, I'm interested in getting a custom tattoo design similar to "${product.name}".`}
                  className="inline-block"
                >
                  <Button
                    variant="outline"
                    className="w-full rounded-none w-[200px]"
                  >
                    Request Custom
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
