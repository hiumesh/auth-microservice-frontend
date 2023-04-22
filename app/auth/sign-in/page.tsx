"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button } from "antd";

import { useAuth } from "@/providers/auth/AuthProvider";

function SignInView() {
  const router = useRouter();
  const { logIn } = useAuth();

  const [error, setError] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);


  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(e.target as HTMLFormElement);
      await logIn({ email: formData.get('email') as string, password: formData.get('password') as string });

      setLoading(false);

      router.replace("/");
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4 md:space-y-6" onSubmit={handleSignIn}>
      <h1 className="hidden lg:block text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
        <span className="text-[#1677FF] text-3xl">Sign in</span> to your account
      </h1>
      <div>
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Your email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="name@company.com"
          required
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="••••••••"
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>

      <Button htmlType="submit" type="primary" shape="round" className="bg-[#1677ff]" size="large" loading={loading}>
        Login to account
      </Button>
      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/sign-up"
          className="font-medium text-primary-600 hover:underline dark:text-primary-500"
        >
          Sign Up here
        </Link>
      </p>
    </form>
  );
}


export default SignInView;
