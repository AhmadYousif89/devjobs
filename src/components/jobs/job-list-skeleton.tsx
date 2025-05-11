import { Skeleton } from '../ui/skeleton';

export const JobListSkeleton = () => {
  return (
    <ul className='grid-layout'>
      {Array.from({ length: 12 }).map((_, index) => (
        <Skeleton key={index} className='relative px-8 pb-8 h-63.25'>
          <Skeleton className='grid place-items-center size-12.5 rounded-2xl absolute left-8 -top-6.25' />
          <div className='flex flex-col items-start pt-12.5 h-full'>
            <div className='flex items-center gap-3'>
              <Skeleton className='w-20 h-4' />
              <Skeleton className='size-2 rounded-full ' />
              <Skeleton className='w-20 h-4' />
            </div>
            <Skeleton className='my-3 w-full h-6' />
            <Skeleton className='w-20 h-4' />
            <Skeleton className='w-32 h-4 mt-auto' />
          </div>
        </Skeleton>
      ))}
    </ul>
  );
};
