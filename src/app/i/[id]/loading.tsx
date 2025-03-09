import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen relative font-lusitana tracking-tight">
      <div className="max-w-6xl mx-auto p-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left side - Images skeleton */}
          <div className="space-y-6">
            <Skeleton className="w-full aspect-[3/4] rounded-md" />
          </div>

          {/* Right side - Product info skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-32 w-full" />
            
            <div className="space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 