import Link from 'next/link';

import { Job } from '@/lib/types';
import { Button } from '../ui/button';

export const JobCard = (job: Job) => {
  return (
    <li className='relative text-left bg-card rounded-sm px-8 pb-8 h-63.25'>
      <div
        style={{ backgroundColor: job.logoBackground }}
        className='grid place-items-center size-12.5 rounded-2xl absolute left-8 -top-6.25'
        dangerouslySetInnerHTML={{ __html: job.logo }}
      />
      <div className='flex flex-col items-start pt-12.5 h-full'>
        <p className='flex items-baseline gap-3 text-accent-foreground'>
          <span className=''>{job.postedAt}</span>
          <span className='h-1 w-1 rounded-full bg-accent-foreground' aria-hidden='true'></span>
          <span className=''>{job.contract}</span>
        </p>
        <Link href={`/jobs/${job.id}`}>
          <Button variant='ghost' className='font-bold p-0 my-3 text-lg h-auto text-left '>
            {job.position}
          </Button>
        </Link>
        <p className='text-accent-foreground'>{job.company}</p>
        <p className='text-primary font-bold mt-auto dark:text-primary-foreground'>
          {job.location}
        </p>
      </div>
    </li>
  );
};
