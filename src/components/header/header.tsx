import Link from 'next/link';

import Logo from 'public/assets/desktop/logo.svg';
import { ThemeSwitcher } from '../theme_switcher';

const headerBgMobile = '/assets/mobile/bg-pattern-header.svg';
const headerBgTablet = '/assets/tablet/bg-pattern-header.svg';
const headerBgDesktop = '/assets/desktop/bg-pattern-header.svg';

export default function MainHeader() {
  return (
    <header className='max-w-[1440px] mx-auto grid relative'>
      <picture className='col-end-1 row-end-1 '>
        <source media='(min-width: 1024px)' srcSet={headerBgDesktop} />
        <source media='(min-width: 768px)' srcSet={headerBgTablet} />
        <img
          src={headerBgMobile}
          alt='bg image'
          loading='eager'
          className='w-full h-[8.5rem] md:h-auto lg:h-[10.125rem]'
        />
      </picture>

      <div className='wrapper col-end-1 row-end-1 w-full pt-8 md:pt-10.5 xl:pt-11.25'>
        <div className='flex items-center justify-between gap-4'>
          <Link href='/'>
            <Logo />
          </Link>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
