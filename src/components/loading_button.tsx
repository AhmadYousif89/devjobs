'use client';

import { useFormStatus } from 'react-dom';

import { Button } from './ui/button';

type ButtonWithLoadingStateProps = React.ComponentProps<typeof Button> & {
  loadingText?: {
    smallScreen?: string;
    largeScreen?: string;
  };
};

export function ButtonWithLoadingState({
  type = 'submit',
  loadingText,
  children,
  ...props
}: ButtonWithLoadingStateProps) {
  const { pending } = useFormStatus();
  const spinner = (
    <div className='flex items-center justify-center gap-2'>
      <div className='size-6 animate-spin rounded-full border-2 border-t-transparent border-white'></div>
    </div>
  );
  const loadingTextElement = loadingText ? (
    <div className='flex items-center gap-2'>
      <span className='md:hidden'>{loadingText.smallScreen}</span>
      <span className='hidden md:block'>{loadingText.largeScreen}</span>
      {spinner}
    </div>
  ) : (
    spinner
  );
  return (
    <Button
      size='icon'
      type={type}
      disabled={pending}
      className='size-12 md:w-20 md:h-12 md:font-bold md:text-base lg:w-30.75'
      {...props}>
      {pending ? loadingTextElement : children}
    </Button>
  );
}
