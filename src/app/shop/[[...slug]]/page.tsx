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
  params: Promise<{ slug: string[] | undefined }>;
}) {
  const { slug } = await params;
  const supabase = createClient();
  
  let query = supabase
    .from("products")
    .select(`
      *,
      category:category_id (
        slug
      )
    `)
    .not("category", "is", null);
    
  // Apply category filter only if slug exists
  if (slug && slug.length > 0) {
    query = query.filter("category.slug", "eq", slug[0]);
  }
  
  const { data: products, error } = await query;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products?.map((product) => {
        const imageSrc = supabase.storage
          .from("product-images")
          .getPublicUrl(product.primary_image_url ?? "");
        return (
          <Link 
            href={`/i/${product.id}`} 
            key={product.id} 
            className="group"
            prefetch={true}
          >
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
  );
}
