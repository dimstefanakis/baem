import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"

export default function ShopLoading() {
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
      
      <div className="relative max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, index) => (
            <div key={index} className="group">
              <div className="relative aspect-[3/4] bg-transparent rounded-lg transition-all duration-300 p-1">
                <Skeleton className="w-full h-full rounded-lg" />
              </div>
              <div className="mt-2 text-center">
                <Skeleton className="h-5 w-2/3 mx-auto mb-2" />
                <Skeleton className="h-5 w-1/3 mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 