import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

import { baseURL } from "@/app/config";

export async function GET(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get('refresh-token');
  
  const response = await fetch(`${baseURL}/auth/logout`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'x-refresh-token': token?.value || "",
    },
  });

  const responseBody = await response.json();

  return NextResponse.json(
    {
      success: responseBody.success,
      message: responseBody.message,
    },
    {
      status: response.status,
      headers: { "Set-Cookie": 'refresh-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT;' },
    }
  );
}