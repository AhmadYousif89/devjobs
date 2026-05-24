import { Suspense } from 'react';

import { FilterOptions } from '@/lib/types';
import { getJobs, getJobsCount } from '@/actions/jobs';

import { JobsList } from '@/components/jobs/job-list';
import { FilterForm } from '@/components/filter/filter';
import { JobListSkeleton } from '@/components/jobs/job-list-skeleton';

export type SearchParams = Promise<{
  query?: string;
  location?: string;
  contract?: FilterOptions['contract'];
  limit?: string;
  skip?: string;
}>;

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const promiseJobs = getJobs({
    ...(sp.query ? { query: sp.query } : {}),
    ...(sp.location ? { location: sp.location } : {}),
    ...(sp.contract ? { contract: sp.contract } : {}),
    ...(sp.limit ? { limit: sp.limit } : {}),
    ...(sp.skip ? { skip: sp.skip } : {}),
  });

  return (
    <main className='wrapper relative font-sans flex flex-col dark:bg-background'>
      <h1 className='sr-only'>Devjobs Web App</h1>
      <FilterForm searchParams={JSON.stringify(sp)} />
      <div className='relative grid py-14.25 md:pt-17.5 lg:pt-26.25'>
        <Suspense fallback={<JobListSkeleton />}>
          <JobsList promiseJobs={promiseJobs} />
        </Suspense>
      </div>
    </main>
  );
}

export async function generateMetadata() {
  const count = await getJobsCount();

  return {
    title: `Devjobs - ${count} jobs available`,
    description: 'Find your dream job in the tech industry with Devjobs.',
  };
}
