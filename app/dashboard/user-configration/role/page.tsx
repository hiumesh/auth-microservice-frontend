import { cookies } from 'next/headers';

import { baseURL } from '@/app/config';
import { RoleListAPI } from '@/interface/role';
import Container from './container';

// const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function getRoles(): Promise<RoleListAPI | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('access-token');

  if (!token) {
    console.log('inside');
    return null;
  } 

  const response = await fetch(`${baseURL}/role`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.value}`
    },
  });

  // await sleep(5000);

  const responseBody = await response.json() as RoleListAPI;
  return responseBody;
}

export default async function IndexPage() {
  const roles = await getRoles();

  return (
    <main>
      <Container initialData={roles?.data || []} />
    </main>
  );
}