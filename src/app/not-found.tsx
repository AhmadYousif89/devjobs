import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className='font-sans mt-32 dark:bg-background'>
      <main className='text-center max-w-5xl mx-auto px-6'>
        <div className='bg-card rounded-md shadow-sm p-10 w-full max-w-3xl mx-auto'>
          <h1 className='text-5xl mb-6 font-bold text-primary dark:text-primary-foreground'>404</h1>
          <h2 className='text-2xl dark:text-secondary-foreground font-bold mb-4'>Page Not Found</h2>
          <p className='text-accent-foreground mb-8'>
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
          <Link href='/'>
            <Button className='rounded dark:text-secondary-foreground' size='lg'>
              Back to Home
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
