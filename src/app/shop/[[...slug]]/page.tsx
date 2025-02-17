import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { createClient } from "@/lib/supabase";

interface TattooDesign {
  id: string;
  name: string;
  price: number | string;
  imageSrc: string;
}

const tattooDesigns: TattooDesign[] = [
  {
    id: "roses1",
    name: "Roses 1",
    price: 50,
    imageSrc: "/kkk.webp",
  },
  {
    id: "sword1",
    name: "Sword 1",
    price: 30,
    imageSrc: "/spider.webp",
  },
  {
    id: "centipede1",
    name: "Centipede 1",
    price: 40,
    imageSrc: "/tramp.webp",
  },
  {
    id: "heart1",
    name: "Heart 1",
    price: "SOLD",
    imageSrc: "/heart.webp",
  },
  {
    id: "heart2",
    name: "Heart 1",
    price: "SOLD",
    imageSrc: "/heart.webp",
  },
  // Add more designs as needed
];

export default async function ShopPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createClient();
  const { data: categories } = await supabase.from("categories").select("*");
  const { data: products, error } = await supabase
    .from("products")
    .select(`
      *,
      category:category_id (
        slug
      )
    `)
    .eq("category_id.slug", slug);

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="fixed inset-0 w-screen h-screen -z-10">
        <Image
          src="/bg.webp"
          alt="Background"
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - now at top on mobile, side on desktop */}
          <div className="w-full md:w-48 md:flex-shrink-0">
            <h2 className="text-2xl font-semibold mb-4 text-black">Filters</h2>
            <nav className="flex md:block space-x-4 md:space-x-0 md:space-y-2 overflow-x-auto pb-4 md:pb-0">
              {categories?.map((category) => (
                <Link
                  key={category.id}
                  href={`/shop/${category.slug}`}
                  className="block text-lg hover:underline text-black whitespace-nowrap"
                >
                  {category.name}
                </Link>
              ))}
              {/* <a
                href="#"
                className="block text-lg hover:underline text-black whitespace-nowrap"
              >
                Custom Packages
              </a>
              <a href="#" className="block text-lg hover:underline text-black whitespace-nowrap">
                Premium Gallery
              </a> */}
            </nav>
          </div>

          {/* Product Grid - updated card styles */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products?.map((product) => {
                const imageSrc = supabase.storage
                  .from("product-images")
                  .getPublicUrl(product.primary_image_url ?? "");
                return (
                  <Link href={`/i/${product.id}`} key={product.id} className="group">
                    <div key={product.id} className="group">
                      <div className="relative aspect-[3/4] bg-transparent rounded-lg transition-all duration-300 p-1">
                        <Image
                          src={imageSrc.data.publicUrl}
                          alt={product.name}
                          fill
                          className="object-cover shadow-md border-2 border-white shadow-inner [box-shadow:inset_0_2px_4px_rgba(0,0,0,0.4)] drop-shadow-md"
                        />
                      </div>
                      <div className="mt-2 text-center">
                        <h3 className="text-lg font-medium text-black">
                          {product.name}
                        </h3>
                        <p className="text-lg text-black">
                          {formatPrice((product.single_purchase_price || 0) / 100)}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
