import Image from "next/image";

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

export default function ShopPage() {
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
              <a href="#" className="block text-lg hover:underline text-black whitespace-nowrap">
                Gothic
              </a>
              <a href="#" className="block text-lg hover:underline text-black whitespace-nowrap">
                Custom Packages
              </a>
              <a href="#" className="block text-lg hover:underline text-black whitespace-nowrap">
                Premium Gallery
              </a>
            </nav>
          </div>

          {/* Product Grid - updated card styles */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tattooDesigns.map((design) => (
                <div key={design.id} className="group">
                  <div className="relative aspect-[3/4] bg-transparent rounded-lg transition-all duration-300 p-1">
                    <Image
                      src={design.imageSrc}
                      alt={design.name}
                      fill
                      className="object-cover shadow-md border-2 border-white shadow-inner [box-shadow:inset_0_2px_4px_rgba(0,0,0,0.4)] drop-shadow-md"
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <h3 className="text-lg font-medium text-black">
                      {design.name}
                    </h3>
                    <p className="text-lg text-black">
                      {typeof design.price === "number"
                        ? `${design.price}$`
                        : design.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
