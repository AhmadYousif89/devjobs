import SearchIcon from 'public/assets/desktop/icon-search.svg';

import { FilterModal } from './dialog-modal';
import { ButtonWithLoadingState } from '../loading_button';
import { Filter, QueryField, LocationField, ContractField, ActionsField } from './context';

export const FilterForm = ({ searchParams }: { searchParams: string }) => {
  return (
    <Filter searchParams={searchParams}>
      <QueryField />
      <LocationField />
      <ActionsField>
        <FilterModal /> {/* Visible on mobile view port only */}
        <ContractField /> {/* Visible on desktop view port only */}
        <ButtonWithLoadingState>
          <span className='hidden md:block'>Search</span>
          <SearchIcon className='*:fill-white size-6 md:hidden' />
          <span className='sr-only md:hidden'>Search icon</span>
        </ButtonWithLoadingState>
      </ActionsField>
    </Filter>
  );
};
