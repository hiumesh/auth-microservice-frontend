import { NextResponse } from "next/server";

import { baseURL } from "@/app/config";

export async function POST(request: Request) {
  const response = await fetch(`${baseURL}/auth/signup`, {
    method: "POST",
    cache: 'no-store',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(await request.json()),
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
      headers: { "Set-Cookie": `refresh-token=${responseBody.data.refreshToken}; HttpOnly; expires=${(new Date(Date.now()+ 86400*1000))};`, 'Cache-Control': 'no-store, max-age=0' },
    }
  );
}
