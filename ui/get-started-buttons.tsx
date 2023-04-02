import { Button } from "@tremor/react";

import Link from "next/link";

export function GetStartedButtons() {
  return (
    <div className="flex items-center">
      <Link href="/auth/sign-in"><Button type="button" variant="light">Sign In</Button></Link>
      <div className="w-4"></div>
      <Link href="/auth/sign-up"><Button size="sm">Sign Up</Button></Link>
    </div>
  );
}