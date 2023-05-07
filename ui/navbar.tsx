"use client";

import { MenuProps, Dropdown } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

import { useAuth } from "@/providers/auth/AuthProvider";
import { GetStartedButtons } from "@/ui/get-started-buttons";


const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Playground", href: "/playground" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logOut, currentUser } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);

  const visible = !["sign-in", "sign-up"].includes(
    pathname?.split("/").at(-1) || ""
  );

  const items: MenuProps["items"] = useMemo(() => [
    {
      label: (
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Image
              className="h-8 w-8 rounded-full"
              src="https://avatar.vercel.sh/leerob"
              height={32}
              width={32}
              alt="avatar"
            />
          </div>
          <div className="ml-3">
            <div className="text-base font-medium text-gray-800">
              {currentUser?.UserName}
            </div>
            <div className="text-sm font-medium text-gray-500">
              {currentUser?.Email}
            </div>
          </div>
        </div>
      ),
      key: "1",
    },
    {
      label: "Sign Out",
      key: "2",
      onClick: () => logOut().then(() => router.replace("/")),
      danger: true,
    },
  ], [currentUser?.Email, currentUser?.UserName, logOut, router]) ;

  return visible ? (
    <nav className="bg-white shadow-sm fixed w-full z-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  className="text-gray-100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="100%"
                    height="100%"
                    rx="16"
                    fill="currentColor"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
                    fill="black"
                  />
                </svg>
              </Link>
            </div>

            {isAuthenticated && (
              <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${pathname?.match(item.href) ? "border-slate-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} inline-flex font-medium items-center px-1 pt-1 border-b-2 text-sm`}
                    aria-current={pathname === item.href ? "page" : undefined}
                  >
                    {item.name} 
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <Dropdown
                menu={{ items }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                  <span className="sr-only">Open user menu</span>
                  <Image
                    className="h-8 w-8 rounded-full"
                    src="https://avatar.vercel.sh/leerob"
                    height={32}
                    width={32}
                    alt="avatar"
                  />
                </button>
              </Dropdown>
            ) : (
              <GetStartedButtons />
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              onClick={() => setMenuVisible(!menuVisible)}
            >
              <span className="sr-only">Open main menu</span>
              {menuVisible ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      {menuVisible && (
        <div className="sm:hidden">
          {isAuthenticated && (
            <div className="space-y-1 pt-2 pb-3">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  className={classNames(
                    pathname === item.href
                      ? "bg-slate-50 border-slate-500 text-slate-700"
                      : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800",
                    "block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                  )}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}

          <div className="border-t border-gray-200 pt-4 pb-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <Image
                      className="h-8 w-8 rounded-full"
                      src="https://avatar.vercel.sh/leerob"
                      height={32}
                      width={32}
                      alt="avatar"
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {currentUser?.UserName}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {currentUser?.Email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <button
                    onClick={() => {
                      logOut().then(() => router.replace("/"));
                    }}
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-1 flex justify-center">
                <GetStartedButtons />
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  ): null;
}
