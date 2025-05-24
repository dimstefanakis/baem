import HomeItem from "@/components/home-item";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ScrollButton from "@/components/scroll-button";
import ShopNowButton from "@/components/shop-now-button";
import { BurgerMenu } from "@/components/BurgerMenu";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

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
          {/* <div className="absolute top-0 right-0 pt-3 pr-4 md:pt-4 md:pr-10 z-20">
            <BurgerMenu />
          </div> */}
          {/* <h1 className="text-4xl font-bold">Hello World</h1>
        <p className="text-lg text-gray-500">Welcome to the home page</p> */}
          <div className="flex w-full items-center justify-center absolute top-10 sm:top-4 left-0">
            <h1 className="text-3xl text-center">Mona Baem</h1>
            <div className="absolute right-10 flex items-center justify-center">
              <BurgerMenu useBackground />
            </div>
          </div>
          <h2 className="text-4xl text-center mb-2 sm:mb-10 mt-8">
            Tattoo Designs
          </h2>
          <Link href="/shop" className="w-full flex justify-center">
            <Image
              src="/cross.webp"
              alt="logo"
              className="w-[90%] md:w-[25%] shadow-md border-2 border-white shadow-inner [box-shadow:inset_0_2px_4px_rgba(0,0,0,0.4)] drop-shadow-md"
              width={642}
              height={857}
            />
          </Link>
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
