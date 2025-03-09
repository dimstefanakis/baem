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

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - Skeleton */}
          <div className="w-full md:w-48 md:flex-shrink-0">
            <Skeleton className="h-8 w-32 mb-4" />
            <div className="flex md:block space-x-4 md:space-x-0 md:space-y-2 overflow-x-auto pb-4 md:pb-0">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>

          {/* Product Grid - Skeletons */}
          <div className="flex-1">
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
      </div>
    </div>
  )
} 