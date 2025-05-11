'use client';

import { createPortal } from 'react-dom';
import { useRef, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import FilterIcon from 'public/assets/mobile/icon-filter.svg';

import { Filter, LocationField, ContractField, ActionsField } from './context';
import { Button } from '../ui/button';
import { ButtonWithLoadingState } from '../loading_button';

export const FilterModal = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // close dialog when view port exceeds 768px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        const dialog = dialogRef.current;
        if (dialog && dialog.open) {
          dialog.close();
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDialog = (state: 'open' | 'close') => {
    const dialog = dialogRef.current;
    if (dialog && state === 'open') {
      dialog.showModal();
    } else if (dialog && state === 'close') {
      dialog.close();
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Prevents the parent <Form /> inside <FilterContent /> from submitting and overriding this dialog form submission.
    e.stopPropagation();

    const formData = new FormData(e.currentTarget);
    const location = formData.get('location')?.toString() || '';
    const contract = formData.get('contract')?.toString() || '';
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('limit');
    newParams.delete('skip');

    if (location) newParams.set('location', location);
    else newParams.delete('location');
    if (contract) newParams.set('contract', contract);
    else newParams.delete('contract');
    router.push(`/?${newParams.toString()}`);
  };

  // create search params object from URLSearchParams
  const params = Object.fromEntries(searchParams.entries());

  const dialogContent = mounted
    ? createPortal(
        <dialog
          id='dialog'
          ref={dialogRef}
          className='rounded-sm bg-card mx-auto min-h-54.25 min-w-85 w-3/4 top-72 -translate-y-1/4 backdrop:bg-very-dark-blue/50 dark:backdrop:bg-background/50 not-open:hidden'>
          <Filter
            variant='mobile'
            onSubmit={handleFormSubmit}
            searchParams={JSON.stringify(params)}>
            <LocationField />
            <div className='p-6 space-y-6'>
              <ContractField />
              <ActionsField>
                <ButtonWithLoadingState className='w-full h-12 font-bold text-base'>
                  Search
                </ButtonWithLoadingState>
              </ActionsField>
            </div>
          </Filter>
          <Button
            type='button'
            variant='ghost'
            className='absolute top-1 right-1 size-6 p-0 text-primary dark:text-muted hover:bg-accent dark:hover:bg-secondary'
            onClick={() => handleDialog('close')}>
            <span className='sr-only'>Close</span>&#x2715;
          </Button>
        </dialog>,
        document.body,
      )
    : null;

  return (
    <div className='md:hidden'>
      <Button
        size='icon'
        type='button'
        id='open-dialog'
        variant='ghost'
        aria-label='Filter icon'
        onClick={() => handleDialog('open')}
        className='size-12 ml-auto mr-3 hover:bg-accent dark:hover:bg-secondary md:hidden'>
        <FilterIcon className='size-6 dark:*:fill-secondary-foreground' />
      </Button>
      {dialogContent}
    </div>
  );
};
