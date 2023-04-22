import { Button } from "antd";

import Link from "next/link";

export function GetStartedButtons() {
  return (
    <div className="flex items-center">
      <Link href="/auth/sign-in"><Button htmlType="button" type="link" size="large">Sign In</Button></Link>
      <div className="w-4"></div>
      <Link href="/auth/sign-up"><Button type="primary" shape="round" className="bg-[#1677ff]" size="large">Sign Up</Button></Link>
    </div>
  );
}