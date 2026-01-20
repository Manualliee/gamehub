import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen p-12">
      {/* Background Skeleton */}
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute inset-0 bg-background" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl space-y-8">
        {/* Gallery + Description */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 items-start">
          {/* Gallery Skeleton */}
          <div className="flex flex-col gap-4">
            <Skeleton className="aspect-video w-full" />
            <div className="flex flex-row gap-4">
              <Skeleton className="aspect-video w-full" />
              <Skeleton className="aspect-video w-full" />
            </div>
          </div>
          {/* Main Header Skeleton */}
          <Skeleton className="h-full rounded-2xl space-y-4 pt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 items-start mt-6">
          <div className="flex flex-col">  
            {/* Price/Cart Section */}
            <div className="block">
              <Skeleton className="h-24 w-full mb-4" />
            </div>

            {/* Description Skeleton */}
            <div className="space-y-4 pt-4 mb-4">
              <Skeleton className="h-8 w-48 mb-6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            {/* DLCs & Additions Skeletons */}
            <div className="space-y-4 pt-4 mb-4">
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="flex flex-row flex-wrap gap-4">
                <Skeleton className="aspect-video w-48 mb-6" />
                <Skeleton className="aspect-video w-48 mb-6" />
                <Skeleton className="aspect-video w-48 mb-6" />
                <Skeleton className="aspect-video w-48 mb-6" />
                <Skeleton className="aspect-video w-48 mb-6" />
                <Skeleton className="aspect-video w-48 mb-6" />
              </div>
            </div>
            {/* Game Series Skeletons */}
            <div className="space-y-4 pt-4 mb-4">
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="flex flex-row flex-wrap gap-4">
                <Skeleton className="aspect-video w-48 mb-6" />
                <Skeleton className="aspect-video w-48 mb-6" />
                <Skeleton className="aspect-video w-48 mb-6" />
                <Skeleton className="aspect-video w-48 mb-6" />
                <Skeleton className="aspect-video w-48 mb-6" />
                <Skeleton className="aspect-video w-48 mb-6" />
              </div>
            </div>
            {/* Suggested Games Skeletons */}
            <div className="space-y-4 pt-4 mb-4">
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="flex flex-row flex-wrap gap-4">
                <Skeleton className="aspect-video w-48 mb-6" />
                <Skeleton className="aspect-video w-48 mb-6" />
                <Skeleton className="aspect-video w-48 mb-6" />
                <Skeleton className="aspect-video w-48 mb-6" />
                <Skeleton className="aspect-video w-48 mb-6" />
                <Skeleton className="aspect-video w-48 mb-6" />
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-6">
            {/* Achievements Skeleton */}
            <Skeleton className="h-48 p-6 rounded-xl border border-border/10 space-y-6" />

            {/* Tags Skeleton */}
            <Skeleton className="h-48 p-6 rounded-xl border border-border/10 space-y-6" />

            {/* Metascore Skeleton */}
            <Skeleton className="h-24 p-4 rounded-lg border border-border/10" />

            {/* Game Website Link Skeleton */}
            <Skeleton className="h-24 p-4 rounded-lg border border-border/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
