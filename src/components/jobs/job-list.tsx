'use client';

import { use, useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Job } from '@/lib/types';
import { JobCard } from './job-card';
import { ButtonWithLoadingState } from '../loading_button';

type JobsResponse = {
  jobs: Job[];
  totalCount: number;
  hasMore: boolean;
  nextCursor: string | null;
};

export const JobsList = ({ promiseJobs }: { promiseJobs: Promise<JobsResponse> }) => {
  const initialData = use(promiseJobs);
  const [allJobs, setAllJobs] = useState<Job[]>(initialData.jobs);
  const [hasMore, setHasMore] = useState(initialData.hasMore);
  const [cursor, setCursor] = useState(initialData.nextCursor);
  const [isLoading, setIsLoading] = useState(false);
  const lastRequestedCursorRef = useRef<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCursor = searchParams.get('cursor');

  useEffect(() => {
    if (currentCursor && lastRequestedCursorRef.current === currentCursor) {
      setAllJobs((currentJobs) => [...currentJobs, ...initialData.jobs]);
    } else {
      setAllJobs(initialData.jobs);
    }
    lastRequestedCursorRef.current = null;
    setHasMore(initialData.hasMore);
    setCursor(initialData.nextCursor);
    setIsLoading(false);
  }, [initialData, currentCursor]);

  const handleLoadMore = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!cursor) return;

    setIsLoading(true);
    lastRequestedCursorRef.current = cursor;
    const params = new URLSearchParams(searchParams.toString());
    params.set('cursor', cursor);
    params.set('limit', '3'); // Load 3 more jobs
    router.push(`?${params.toString()}`, { scroll: false });
  };

  if (allJobs.length === 0)
    return (
      <p className='md:text-xl text-center text-accent-foreground font-medium dark:text-accent-foreground'>
        No jobs found <br /> Maybe try a different search?
      </p>
    );

  return (
    <>
      <div className='absolute -top-1.5 right-0 text-xs text-accent-foreground mt-2 bg-card px-2 h-8 rounded flex items-center gap-6 overflow-x-auto'>
        <ul className='hidden md:has-[.flex]:flex items-center divide-x-2 divide-accent *:h-full *:px-2'>
          {[...searchParams.entries()]
            .filter(([key, value]) => value !== '' && key !== 'limit' && key !== 'cursor')
            .map(([key, value]) => {
              return (
                <li key={key} className='flex items-center gap-1'>
                  <span className='font-semibold'>{key.toUpperCase()}</span> :{' '}
                  <span
                    title={value}
                    className='inline-block border border-dotted rounded lg:px-1 truncate max-w-136.25'
                  >
                    {value}
                  </span>
                </li>
              );
            })}
        </ul>
        <p className='ml-auto whitespace-nowrap'>
          Showing {allJobs.length} of {initialData.totalCount} jobs
        </p>
      </div>
      <ul className='grid-layout'>
        {allJobs.map((job) => (
          <JobCard key={job._id} {...job} />
        ))}
      </ul>

      {hasMore && (
        <form onSubmit={handleLoadMore} className='flex justify-center mt-8 md:mt-14'>
          <ButtonWithLoadingState
            type='submit'
            disabled={isLoading}
            className='w-full max-w-35.25 h-12 text-base font-bold'
          >
            Load More
          </ButtonWithLoadingState>
        </form>
      )}
    </>
  );
};
