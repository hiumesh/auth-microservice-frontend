import { cookies } from 'next/headers';

import Navbar from "@/ui/navbar";
import { AuthProvider } from "@/providers/auth/AuthProvider";

import { UserSessionApiResponse, UserSessionWithToken } from "@/interface/user";
import { baseURL } from "./config";

export async function getUserSession(): Promise<null | UserSessionWithToken> {

  const cookieStore = cookies();
  const token = cookieStore.get('refresh-token');

  if (!token) {
    console.log('inside');
    return null;
  } 
  
  const response = await fetch(`${baseURL}/auth/session`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      'x-refresh-token': token?.value || "",
    },
  });

  const responseBody = await response.json() as UserSessionApiResponse;



 
  if (responseBody.success) {
    return responseBody.data as UserSessionWithToken;
  }
  return null;

}


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const currentUser = await getUserSession();

  return (
    <html lang="en">
      <head></head>

      <body className="overflow-y-scroll bg-gray-50">
        <AuthProvider session={currentUser}>
           <Navbar user={{}}/>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
