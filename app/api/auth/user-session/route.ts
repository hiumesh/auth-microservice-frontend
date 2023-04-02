import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

import { baseURL } from "@/app/config";

export async function GET(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get('refresh-token');

  if (!token) {
    return NextResponse.json({
      success: false,
      message: "NO TOKENNN",
    }, { status: 400 })
  } 
  
  const response = await fetch(`${baseURL}/auth/session`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      'x-refresh-token': token?.value || "",
    },
  });

  const responseBody = await response.json();

  return NextResponse.json(
    {
      success: responseBody.success,
      message: responseBody.message,
      data: responseBody.data,
    },
    {
      status: response.status,
    }
  );
}