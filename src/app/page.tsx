import HomeItem from "@/components/home-item";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ScrollButton from "@/components/scroll-button";
// import ShopNowButton from "@/components/shop-now-button";

export default function Home() {
  return (
    <div>
      <div className="relative h-screen w-screen">
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
            className="w-[90%] md:w-[30%] shadow-md border-2 border-white shadow-inner [box-shadow:inset_0_2px_4px_rgba(0,0,0,0.4)] drop-shadow-md"
            width={642}
            height={857}
          />
          <ScrollButton />
        </div>
      </div>
      <div id="gallery-section" className="flex flex-col items-center justify-center w-full">
        {/* <ShopNowButton /> */}
        <HomeItem imageSrc="/kkk.webp" title="KKK" />
        <HomeItem imageSrc="/spider.webp" title="Spider" />
        <HomeItem imageSrc="/anime.webp" title="Anime" />
        <HomeItem imageSrc="/tramp.webp" title="Tramp" />
        <HomeItem imageSrc="/heart.webp" title="Heart" />
      </div>
    </div>
  );
}
