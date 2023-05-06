import { cookies } from 'next/headers';

import { baseURL } from '@/app/config';
import { PermissionListAPI } from '@/interface/permission';
import Container from './container';

// const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function getInitialPermissions(): Promise<PermissionListAPI | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('access-token');

  if (!token) {
    console.log('inside');
    return null;
  } 

  const response = await fetch(`${baseURL}/permission`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.value}`
    },
  });

  // await sleep(5000);

  const responseBody = await response.json() as PermissionListAPI;
  return responseBody;
}

export default async function IndexPage() {
  const permissions = await getInitialPermissions();

  return (
    <main>
      <Container initialTableData={permissions?.data} />
    </main>
  );
}