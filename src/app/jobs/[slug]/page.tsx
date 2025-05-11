import Form from 'next/form';
import { ObjectId } from 'mongodb';
import { notFound } from 'next/navigation';

import { Job } from '@/lib/types';
import connectToDatabase from '@/lib/db';
import { Button } from '@/components/ui/button';
import { ButtonWithLoadingState } from '@/components/loading_button';

type Params = Promise<{ slug: string }>;

export default async function JobPage({ params }: { params: Params }) {
  const { slug } = await params;
  // verfy if job id is a valid ObjectId
  if (!ObjectId.isValid(slug)) return notFound();

  const job = await getJobById(slug);

  if (!job) return notFound();

  return (
    <>
      <main className='font-sans wrapper max-w-[730px] -mt-4 space-y-6 md:-mt-10'>
        <header className='relative md:overflow-hidden grid max-md:place-items-center rounded-sm bg-card h-54.5 md:h-35 md:grid-cols-[140px_1fr] md:rounded-tl-none'>
          <div
            style={{ backgroundColor: job.logoBackground }}
            className='grid place-content-center rounded-2xl max-md:absolute max-md:left-1/2 max-md:-translate-x-1/2 max-md:-top-6.25 md:rounded-none'>
            <span
              dangerouslySetInnerHTML={{ __html: job.logo }}
              className='grid place-content-center size-12.5 md:size-full md:scale-[2]'
            />
          </div>
          <div className='text-center mt-4.25 md:mt-0 md:flex md:items-center md:justify-between md:px-10'>
            <div className='space-y-3.25 pb-6 md:pb-0'>
              <h1 className='text-xl font-bold text-very-dark-blue dark:text-secondary-foreground'>
                {job.company}
              </h1>
              <p className='text-accent-foreground dark:text-accent'>{job.company}.com</p>
            </div>
            <Button variant='secondary' className='w-36.75 min-h-12 font-bold'>
              Company Site
            </Button>
          </div>
        </header>

        <article className='bg-card px-6 py-10 mb-16 rounded-sm md:p-12'>
          <section className='flex flex-col gap-12.5 md:flex-row md:justify-between md:items-center'>
            <div>
              <p className='flex items-baseline gap-3 text-accent-foreground dark:text-accent'>
                <span>{job.postedAt}</span>
                <span
                  className='h-1 w-1 rounded-full bg-accent-foreground dark:bg-accent'
                  aria-hidden='true'></span>
                <span className=''>{job.contract}</span>
              </p>
              <h2 className='mt-2 mb-3 font-bold text-very-dark-blue dark:text-secondary-foreground md:text-[28px]'>
                {job.position}
              </h2>
              <p className='text-primary text-sm font-bold dark:text-primary-foreground'>
                {job.location}
              </p>
            </div>
            <Form action='/'>
              <ButtonWithLoadingState
                loadingText={{ smallScreen: 'Sending application', largeScreen: 'Sending' }}
                className='w-full font-bold min-h-12 content-("my-content") md:w-35.25'>
                Apply Now
              </ButtonWithLoadingState>
            </Form>
          </section>
          {/* Description */}
          <div className='mt-8 mb-10 md:my-10'>
            <p className='text-accent-foreground dark:text-muted'>{job.description}</p>
          </div>
          {/* Requirements */}
          <section className='space-y-6 mb-10'>
            <div className='space-y-7'>
              <h3 className='text-very-dark-blue text-xl font-bold dark:text-secondary-foreground'>
                Requirements
              </h3>
              <p className='text-accent-foreground dark:text-muted'>{job.requirements.content}</p>
            </div>
            <ul className='list-disc pl-4 space-y-4 marker:text-primary dark:marker:text-primary-foreground marker:font-bold'>
              {job.requirements.items.map((item, index) => (
                <li key={index} className='text-accent-foreground dark:text-muted pl-6'>
                  {item}
                </li>
              ))}
            </ul>
          </section>
          {/* Role */}
          <section className='space-y-6'>
            <div className='space-y-7'>
              <h3 className='text-very-dark-blue text-xl font-bold uppercase dark:text-secondary-foreground'>
                what you will do
              </h3>
              <p className='text-accent-foreground dark:text-muted'>{job.role.content}</p>
            </div>
            <ol className='list-decimal pl-4 space-y-4 marker:text-primary dark:marker:text-primary-foreground marker:font-bold'>
              {job.role.items.map((item, index) => (
                <li key={index} className='text-accent-foreground dark:text-muted pl-6'>
                  {item}
                </li>
              ))}
            </ol>
          </section>
        </article>
      </main>
      <footer className='bg-card p-6 rounded-tr-sm rounded-tl-sm max-w-[1440px] mx-auto md:px-10 md:py-4.5'>
        <Form action='/'>
          <fieldset className='max-w-3xl mx-auto flex items-center justify-between'>
            <div className='hidden space-y-2 md:block'>
              <h2 className='text-very-dark-blue text-xl font-bold dark:text-secondary-foreground'>
                {job.position}
              </h2>
              <p className='text-accent-foreground dark:text-muted'>So Digital Inc.</p>
            </div>
            <ButtonWithLoadingState
              loadingText={{ smallScreen: 'Sending application', largeScreen: 'Sending' }}
              className='max-md:max-w-2xl max-md:w-full max-md:mx-auto font-bold min-h-12 md:w-35.25'>
              Apply Now
            </ButtonWithLoadingState>
          </fieldset>
        </Form>
      </footer>
    </>
  );
}

async function getJobById(id: string) {
  const { db } = await connectToDatabase();
  const mongoData = await db.collection<Job>('jobs').findOne({ _id: new ObjectId(id) });

  if (!mongoData) return null;

  const data = {
    id: mongoData._id.toString(),
    company: mongoData.company,
    logo: mongoData.logo,
    logoBackground: mongoData.logoBackground,
    position: mongoData.position,
    postedAt: mongoData.postedAt,
    contract: mongoData.contract,
    location: mongoData.location,
    website: mongoData.website,
    apply: mongoData.apply,
    description: mongoData.description,
    requirements: mongoData.requirements,
    role: mongoData.role,
  };

  return data;
}
