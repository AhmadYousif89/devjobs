'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

import IconSun from 'public/assets/desktop/icon-sun.svg';
import IconMoon from 'public/assets/desktop/icon-moon.svg';

type Theme = 'system' | 'light' | 'dark';

export const ThemeSwitcher = () => {
  const [theme, setTheme] = useState<Theme>('system');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  // Initialize media query
  const getMediaQuery = () => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)');
    }
  };

  // Handle system theme changes
  const onSystemThemeChange = useCallback((e?: MediaQueryListEvent) => {
    const isDarkMode = e ? e.matches : getMediaQuery()?.matches;
    setSystemTheme(isDarkMode ? 'dark' : 'light');
  }, []);

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }

    const mediaQuery = getMediaQuery();
    if (mediaQuery) {
      onSystemThemeChange();
      mediaQuery.addEventListener('change', onSystemThemeChange);
      return () => mediaQuery.removeEventListener('change', onSystemThemeChange);
    }
  }, [onSystemThemeChange]);

  // Apply theme changes to DOM
  useEffect(() => {
    const root = document.documentElement;
    const effectiveTheme = theme === 'system' ? systemTheme : theme;

    root.classList.remove('light', 'dark');
    root.classList.add(effectiveTheme);
  }, [theme, systemTheme]);

  const handleThemeChange = () => {
    const currentTheme = theme === 'system' ? systemTheme : theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Calculate the current visual theme state for UI
  const isDarkMode = theme === 'system' ? systemTheme === 'dark' : theme === 'dark';

  return (
    <div className='flex items-center justify-between gap-4'>
      <IconSun className='size-5' />
      <button
        className='relative group flex min-w-6 w-12 h-6 rounded-full bg-white cursor-pointer'
        onClick={handleThemeChange}>
        <span className='sr-only'>Toggle theme</span>
        <span
          className={cn(
            'absolute left-1 self-center h-3.5 w-3.5 rounded-full bg-primary transition-transform duration-300 ease-in-out transform',
            'group-hover:bg-hover',
            isDarkMode ? 'min-[275px]:translate-x-6.5 bg-primary-foreground' : 'translate-x-0',
          )}
        />
      </button>
      <IconMoon className='size-3.5' />
    </div>
  );
};
