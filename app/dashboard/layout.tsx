import React from "react";

import { GlobalNav } from "@/ui/global-nav";
import { AddressBar } from "@/ui/address-bar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GlobalNav />

      <div className="lg:pl-72 pt-[64px]">
        <div className="mx-auto max-w-4xl space-y-8 px-2 pt-20 lg:py-8 lg:px-8">
          <div className="rounded-lg  p-px shadow-sm shadow-black/20">
            <div className="rounded-lg">
              <AddressBar />
            </div>
          </div>

          <div className="rounded-lg  p-px shadow-sm shadow-black/20 bg-white">
            <div className="rounded-lg p-3.5 lg:p-6">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
