import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-sm bg-muted/50 dark:bg-muted/15', className)}
      {...props}
    />
  );
}

export { Skeleton };
