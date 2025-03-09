import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: categories } = await supabase.from("categories").select("*");

  return (
    <div className="min-h-screen relative font-lusitana tracking-tight">
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
            </nav>
          </div>

          {/* Main content area */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 