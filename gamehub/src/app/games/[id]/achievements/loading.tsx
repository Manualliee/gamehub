import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
        <div className="flex flex-col gap-5">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-10" />
            <Skeleton className="h-34 w-full" />
            <Skeleton className="h-34 w-full" />
            <Skeleton className="h-34 w-full" />
            <Skeleton className="h-34 w-full" />
            <Skeleton className="h-34 w-full" />
            <Skeleton className="h-34 w-full" />
            <Skeleton className="h-34 w-full" />
            <Skeleton className="h-34 w-full" />
        </div>
    </div>

  );
}
