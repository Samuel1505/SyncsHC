interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-white/5 ${className}`}
    />
  );
}

export function PiggyBankCardSkeleton() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-3 w-full rounded-full" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 flex-1 rounded-lg" />
        <Skeleton className="h-8 flex-1 rounded-lg" />
      </div>
    </div>
  );
}

export function SummaryCardSkeleton() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function TransactionRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-3">
      <Skeleton className="w-8 h-8 rounded-full" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-16 ml-auto" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}
