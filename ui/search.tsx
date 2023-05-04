'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useEffect, useState, ChangeEvent, useRef, Dispatch } from 'react';

interface SearchPropeTypes {
  disabled?: boolean
  loading: boolean
  setQueryE: Dispatch<string>
}

export default function Search({ disabled, loading, setQueryE }: SearchPropeTypes) {

  const [searchTerm, setSearchTerm] = useState('');
  const isMounted = useRef(false);

  
  useEffect(() => {
    let delayDebounceFn: undefined | ReturnType<typeof setTimeout>;
    if (isMounted.current) {
      delayDebounceFn = setTimeout(() => {
        setQueryE(searchTerm);
      }, 500);
    } else {
      isMounted.current = true;
    }  

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, setQueryE]);

  function handleSearchInputChange(event: ChangeEvent<HTMLInputElement>) {
    if (typeof event.target.value === "string") setSearchTerm(event.target.value);
    else setSearchTerm("");
  }

  return (
    <div className="relative max-w-md">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="rounded-md shadow-sm">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
          aria-hidden="true"
        >
          <MagnifyingGlassIcon
            className="mr-3 h-4 w-4 text-gray-400"
            aria-hidden="true"
          />
        </div>
        <input
          type="text"
          name="search"
          id="search"
          disabled={disabled}
          className="h-10 block w-full rounded-md border border-gray-200 pl-9 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Search by name..."
          spellCheck={false}
          value={searchTerm}
          onChange={handleSearchInputChange}
        />
      </div>

      {loading && (
        <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}