'use client';

import { demos, type Item } from '@/lib/demos';
import { NextLogo } from '@/ui/next-logo';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useState } from 'react';

export function GlobalNav() {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <div className="fixed top-[64px] xl:left-[calc(((100vw-80rem)/2)+1rem)] bg-white z-10 flex w-full flex-col lg:bottom-0 lg:z-auto lg:w-72">
      <div className="flex h-14 items-center py-4 px-4 lg:h-auto">
        <Link
          href="/"
          className="group flex w-full items-center gap-x-2.5"
          onClick={close}
        >
          <div className="h-7 w-7 rounded-full border border-white/30 group-hover:border-white/50">
            <NextLogo />
          </div>

          <h3 className="font-semibold tracking-wide bg-gradient-to-r from-vercel-cyan via-vercel-blue to-vercel-violet inline-block text-transparent bg-clip-text">
            Navigation <span className="Work in progress">(WIP)</span>
          </h3>
        </Link>
      </div>
      <button
        type="button"
        className="group absolute right-0 top-0 flex h-14 items-center gap-x-2 px-4 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="font-medium text-gray-400 group-hover:text-gray-600">
          Menu
        </div>
        {isOpen ? (
          <XMarkIcon className="block w-6 text-gray-400" />
        ) : (
          <Bars3Icon className="block w-6 text-gray-400" />
        )}
      </button>

      <div
        className={clsx('overflow-y-auto lg:static lg:block', {
          'fixed inset-x-0 bottom-0 top-14 mt-px': isOpen,
          hidden: !isOpen,
        })}
      >
        <nav className="space-y-6 px-2 py-5">
          {demos.map((section) => {
            return (
              <div key={section.name}>
                <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-800">
                  <div>{section.name}</div>
                </div>

                <div className="space-y-1">
                  {section.items.map((item) => (
                    <GlobalNavItem key={item.slug} item={item} close={close} />
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function GlobalNavItem({
  item,
  close,
}: {
  item: Item;
  close: () => false | void;
}) {
  const path = usePathname();

  const isActive = path?.match(item.slug)

  return (
    <Link
      onClick={close}
      href={`/${item.slug}`}
      className={clsx(
        'block rounded-md px-3 py-2 text-sm font-medium hover:text-slate-700',
        {
          'text-slate-500 hover:bg-gray-50': !isActive,
          'text-blue-500': isActive,
        },
      )}
    >
      {item.name}
    </Link>
  );
}