'use client';

import { Button } from '@/components/ui/button';

type ErrorBoundaryProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  return (
    <main className='font-sans mt-12 xl:mt-24 mx-6 grid place-content-center'>
      <div className='grid max-w-[1110px] bg-primary-foreground dark:bg-card p-8 space-y-8 min-h-60 rounded-sm'>
        <h1 className='text-xl md:text-3xl mb-4 text-red-500 font-bold'>Error!</h1>
        <p className='md:text-xl text-very-dark-blue dark:text-accent-foreground font-medium pb-2 border-b border-b-muted'>
          Unexpected error happened while retirving the data.
        </p>
        <p className='md:text-xl dark:text-secondary bg-red-200 p-2 max-h-24 xl:max-h-40 overflow-y-scroll'>
          {error.message}
        </p>
        <div className='flex items-center justify-between gap-4 mt-8 *:flex-1'>
          <Button onClick={reset} className='md:text-xl xl:h-14'>
            Try Again
          </Button>
          <Button
            onClick={() => window.location.replace('/')}
            variant='outline'
            className=' md:text-xl xl:h-14'>
            Back to Home
          </Button>
        </div>
      </div>
    </main>
  );
}
