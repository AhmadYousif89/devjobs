'use client';

import Form from 'next/form';
import { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';
import SearchIcon from 'public/assets/desktop/icon-search.svg';
import LocationIcon from 'public/assets/desktop/icon-location.svg';
import ContractIcon from 'public/assets/desktop/icon-contract.svg';

import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { ButtonWithLoadingState } from '../loading_button';

const FilterContext = createContext<{
  isMobile: boolean;
  variant: 'desktop' | 'mobile';
  defaultValues: {
    query?: string;
    location?: string;
    contract?: string;
  };
} | null>(null);

const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('Filter components must be used within a Filter.Root component');
  }
  return context;
};

// Root & wrapper component
type FilterRootProps = {
  searchParams: string;
  variant?: 'desktop' | 'mobile';
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
} & PropsWithChildren;

export function Filter({ searchParams, onSubmit, variant = 'desktop', children }: FilterRootProps) {
  const params = JSON.parse(searchParams);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formClasses =
    variant === 'mobile'
      ? ''
      : cn(
          'flex items-center justify-between gap-1 -mt-10 px-4',
          '*:h-full *:not-first:pl-4 bg-white dark:bg-primary h-20 rounded-sm',
          'md:divide-x md:divide-accent dark:divide-secondary',
        );

  return (
    <FilterContext.Provider value={{ isMobile, variant, defaultValues: params }}>
      <Form
        action='/'
        id='filter-form'
        key={searchParams}
        onSubmit={onSubmit}
        className={formClasses}>
        {children}
      </Form>
    </FilterContext.Provider>
  );
}

// Query component
export function QueryField() {
  const {
    defaultValues: { query },
  } = useFilterContext();

  return (
    <fieldset className='flex items-center flex-1 xl:basis-[13.5%]'>
      <label htmlFor='query'>
        <span className='hidden md:block sr-only'>Search icon</span>
        <SearchIcon className='hidden md:block size-6 mr-2' />
      </label>
      <Input
        id='query'
        type='text'
        name='query'
        defaultValue={query}
        aria-label='Search for jobs on the Devjobs platform.'
        title='Filter jobs by title, companies and expertise.'
        placeholder='Filter by title, companies, expertise...'
        className='truncate p-2'
      />
    </fieldset>
  );
}

// Location component
export function LocationField() {
  const {
    defaultValues: { location },
    variant,
  } = useFilterContext();
  const isMobile = variant === 'mobile';
  const fieldClasses = isMobile
    ? 'flex items-center self-start py-6 border-b border-accent dark:border-accent'
    : 'hidden md:flex items-center flex-1';

  return (
    <fieldset className={cn(fieldClasses)}>
      <label htmlFor={isMobile ? 'location-mobile' : 'location'}>
        <span className='sr-only'>Location icon</span>
        <LocationIcon className={cn('size-6', isMobile ? 'ml-7 mr-1' : '')} />
      </label>
      <Input
        type='text'
        name='location'
        id={isMobile ? 'location-mobile' : 'location'}
        defaultValue={location || ''}
        aria-label='Search jobs by their location.'
        placeholder='Filter by location'
        className='text-input truncate p-2 placeholder:text-placeholder dark:text-white'
      />
    </fieldset>
  );
}

// Contract component
export function ContractField() {
  const {
    defaultValues: { contract },
    variant,
  } = useFilterContext();
  const [selectedContracts, setSelectedContracts] = useState<string[]>(
    contract ? contract.split(',') : [],
  );
  const isMobile = variant === 'mobile';

  const handleCheckboxChange = (contractType: string) => {
    setSelectedContracts((prev) => {
      if (prev.includes(contractType)) {
        return prev.filter((type) => type !== contractType);
      } else {
        return [...prev, contractType];
      }
    });
  };

  return (
    <fieldset className={cn('flex items-center gap-4 w-full', isMobile ? '' : 'hidden md:flex')}>
      {isMobile && <ContractIcon className='text-primary dark:text-primary-foreground' />}

      <label htmlFor={isMobile ? 'contract-mobile' : 'contract'} className='sr-only'>
        Contract icon
      </label>

      <input type='hidden' name='contract' value={selectedContracts.join(',')} />

      {isMobile ? (
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-1'>
            <Checkbox
              id={isMobile ? 'contract-full-time-mobile' : 'contract-full-time'}
              checked={selectedContracts.includes('Full Time')}
              onCheckedChange={() => handleCheckboxChange('Full Time')}
              className='size-5 rounded border-0 bg-checkbox dark:aria-checked:bg-checkbox-checked cursor-pointer'
            />
            <label
              htmlFor={isMobile ? 'contract-full-time-mobile' : 'contract-full-time'}
              className='text-xs whitespace-nowrap dark:text-secondary-foreground cursor-pointer'>
              Full Time
            </label>
          </div>

          <div className='flex items-center gap-1'>
            <Checkbox
              id={isMobile ? 'contract-part-time-mobile' : 'contract-part-time'}
              checked={selectedContracts.includes('Part Time')}
              onCheckedChange={() => handleCheckboxChange('Part Time')}
              className='size-5 rounded border-0 bg-checkbox dark:aria-checked:bg-checkbox-checked cursor-pointer'
            />
            <label
              htmlFor={isMobile ? 'contract-part-time-mobile' : 'contract-part-time'}
              className='text-xs whitespace-nowrap dark:text-secondary-foreground cursor-pointer'>
              Part Time
            </label>
          </div>

          <div className='flex items-center gap-1'>
            <Checkbox
              id={isMobile ? 'contract-freelance-mobile' : 'contract-freelance'}
              checked={selectedContracts.includes('Freelance')}
              onCheckedChange={() => handleCheckboxChange('Freelance')}
              className='size-5 rounded border-0 bg-checkbox dark:aria-checked:bg-checkbox-checked cursor-pointer'
            />
            <label
              htmlFor={isMobile ? 'contract-freelance-mobile' : 'contract-freelance'}
              className='text-xs whitespace-nowrap dark:text-secondary-foreground cursor-pointer'>
              Freelance
            </label>
          </div>
        </div>
      ) : (
        <select
          aria-label='Filter Contracts'
          title='Filter jobs by contract type.'
          id={isMobile ? 'contract-mobile' : 'contract'}
          defaultValue={contract}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedContracts(value ? [value] : []);
          }}
          className={cn(
            'cursor-pointer bg-card dark:bg-primary',
            selectedContracts[0] ? 'text-input dark:text-white' : 'text-placeholder',
            isMobile ? '' : 'hidden md:block',
          )}>
          <option value='' className='text-sm'>
            Filter by contracts
          </option>
          <option value='Full Time' className='text-sm text-very-dark-blue dark:text-white'>
            Full Time
          </option>
          <option value='Part Time' className='text-sm text-very-dark-blue dark:text-white'>
            Part Time
          </option>
          <option value='Freelance' className='text-sm text-very-dark-blue dark:text-white'>
            Freelance
          </option>
        </select>
      )}
    </fieldset>
  );
}

// Actions component
type ActionsFieldProps = { className?: string } & PropsWithChildren;
export function ActionsField({ className, children }: ActionsFieldProps) {
  return (
    <fieldset className={cn('flex items-center justify-end flex-1 md:gap-3', className)}>
      {children}
    </fieldset>
  );
}

Filter.Query = QueryField;
Filter.Location = LocationField;
Filter.Contract = ContractField;
Filter.Actions = ActionsField;

// Backward compatible component (using the new compound pattern internally)
export const FilterContent = ({ searchParams }: { searchParams: string }) => {
  return (
    <Filter searchParams={searchParams}>
      <Filter.Query />
      <Filter.Location />
      <fieldset className='flex items-center justify-end flex-1 md:gap-3'>
        <Filter.Contract />
        <ButtonWithLoadingState>
          <span className='hidden md:block'>Search</span>
          <SearchIcon className='*:fill-white size-6 md:hidden' />
          <span className='sr-only md:hidden'>Search icon</span>
        </ButtonWithLoadingState>
      </fieldset>
    </Filter>
  );
};
