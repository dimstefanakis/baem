import HomeItem from "@/components/home-item";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ScrollButton from "@/components/scroll-button";
import ShopNowButton from "@/components/shop-now-button";
import { createClient } from "@/lib/supabase";

export default async function Home() {
  const supabase = createClient();
  const { data: categories } = await supabase.from("categories").select("*");

  return (
    <div>
      <div className="relative h-[100dvh] w-screen">
        <Image
          src="/bg.webp"
          alt="bg"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          {/* <h1 className="text-4xl font-bold">Hello World</h1>
        <p className="text-lg text-gray-500">Welcome to the home page</p> */}
          <h1 className="text-3xl text-center mb-4">Mona Baem</h1>
          <h2 className="text-4xl text-center mb-10">
            Tattoo Designs
          </h2>
          <Image
            src="/cross.webp"
            alt="logo"
            className="w-[90%] md:w-[25%] shadow-md border-2 border-white shadow-inner [box-shadow:inset_0_2px_4px_rgba(0,0,0,0.4)] drop-shadow-md"
            width={642}
            height={857}
          />
          <ScrollButton />
        </div>
      </div>
      <div id="gallery-section" className="flex flex-col items-center justify-center w-full pt-16">
        <div className="flex flex-col items-center justify-center w-full relative">
          <ShopNowButton />
        </div>

        {categories?.map((category) => {
          const imageSrc = supabase.storage.from("categories").getPublicUrl(category.image_url ?? "");

          return (
            <HomeItem
              key={category.id}
              imageSrc={imageSrc.data.publicUrl}
              title={category.name}
              slug={category.slug ?? ""}
            />
          );
        })}
      </div>
    </div>
  );
}
