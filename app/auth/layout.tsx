'use client';

import React from "react";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <section className="relative h-full px-6 py-24 md:flex md:items-center md:justify-center lg:flex lg:items-center lg:justify-center lg:p-0 lg:h-screen bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-fuchsia-300 via-green-400 to-rose-700">
      
      <div className="p-3 w-full md:max-w-[400px] flex flex-col lg:flex-row  items-center justify-center lg:justify-between lg:p-8 bg-white lg:max-w-[1000px]">
      <button
        type="button"
        className="self-end lg:absolute top-2 right-2 bg-slate-200 lg:bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        onClick={(e) => {
          e.preventDefault();
          router.push("/");
        }}
      >
        <span className="sr-only">Close menu</span>

        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
        <div className="mb-12 md:mb-0 lg:w-3/5">
          <img
            src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
            className="w-full"
            alt="Phone image"
          />
        </div>
        <div className="w-full m-7 lg:m-0 lg:ml-6 lg:w-2/5">{children}</div>
      </div>
    </section>
  );
}
