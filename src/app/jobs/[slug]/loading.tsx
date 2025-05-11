import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <>
      <div className='wrapper max-w-[730px] -mt-4 space-y-6 md:-mt-10'>
        <Skeleton className='relative md:overflow-hidden grid max-md:place-items-center rounded-sm h-54.5 md:h-35 md:grid-cols-[140px_1fr] md:rounded-tl-none'>
          <Skeleton className='size-12.5 md:size-full rounded-2xl max-md:absolute max-md:left-1/2 max-md:-translate-x-1/2 max-md:-top-6.25 md:rounded-none' />
          <div className='mt-4.25 md:mt-0 md:flex md:items-center md:justify-between md:px-10'>
            <div className='space-y-3.25 pb-6 md:pb-0'>
              <Skeleton className='w-20 h-4 mx-auto' />
              <Skeleton className='w-28 h-4 mx-auto' />
            </div>
            <Skeleton className='w-36.75 min-h-12' />
          </div>
        </Skeleton>

        <Skeleton className='px-6 py-10 mb-16 rounded-sm md:p-12'>
          <div className='flex flex-col gap-12.5 md:flex-row md:justify-between md:items-center'>
            <div>
              <div className='flex items-baseline gap-3'>
                <Skeleton className='w-16 h-3' />
                <Skeleton className='size-2' />
                <Skeleton className='w-16 h-3' />
              </div>
              <Skeleton className='mt-2 mb-3 w-40 h-4' />
              <Skeleton className='w-20 h-4' />
            </div>
            <Skeleton className='w-full font-bold min-h-12 md:w-35.25' />
          </div>
          {/* Description */}
          <div className='mt-8 mb-10 md:my-10 space-y-3'>
            <Skeleton className='w-full h-2' />
            <Skeleton className='w-full h-2' />
            <Skeleton className='w-3/4 h-2' />
            <Skeleton className='w-full h-2' />
            <Skeleton className='w-3/4 h-2' />
            <Skeleton className='w-full h-2' />
          </div>
          {/* Requirements */}
          <section className='space-y-6 mb-10'>
            <div className='space-y-7'>
              <Skeleton className='w-40 h-6' />
              <div className='space-y-3'>
                <Skeleton className='w-1/2 h-2' />
                <Skeleton className='w-full h-2' />
                <Skeleton className='w-3/4 h-2' />
                <Skeleton className='w-full h-2' />
                <Skeleton className='w-3/4 h-2' />
              </div>
            </div>
            <ul className='pl-4 space-y-4'>
              {Array.from({ length: 6 }, (_, index) => (
                <li key={index} className='pl-6'>
                  <Skeleton className='w-full h-2' />
                </li>
              ))}
            </ul>
          </section>
          {/* Role */}
          <section className='space-y-6'>
            <div className='space-y-7'>
              <Skeleton className='w-40 h-6' />
              <div className='space-y-3'>
                <Skeleton className='w-1/2 h-2' />
                <Skeleton className='w-full h-2' />
                <Skeleton className='w-3/4 h-2' />
                <Skeleton className='w-full h-2' />
                <Skeleton className='w-3/4 h-2' />
              </div>
            </div>
            <ul className='pl-4 space-y-4'>
              {Array.from({ length: 6 }, (_, index) => (
                <li key={index} className='pl-6'>
                  <Skeleton className='w-full h-2' />
                </li>
              ))}
            </ul>
          </section>
        </Skeleton>
      </div>
      <Skeleton className='p-6 rounded-tr-sm rounded-tl-sm max-w-[1440px] mx-auto md:px-10 md:py-4.5'>
        <div className='max-w-3xl mx-auto flex items-center justify-between'>
          <div className='hidden space-y-2 md:block'>
            <Skeleton className='w-40 h-5' />
            <Skeleton className='w-28 h-4' />
          </div>
          <Skeleton className='max-md:max-w-2xl max-md:w-full max-md:mx-auto min-h-12 md:w-35.25' />
        </div>
      </Skeleton>
    </>
  );
}
