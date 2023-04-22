import { cookies } from 'next/headers';

import { baseURL } from '@/app/config';
import { UserListAPI } from '@/interface/user';
import Container from './container';

// const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function getInitialUsers(): Promise<UserListAPI | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('access-token');

  if (!token) {
    console.log('inside');
    return null;
  } 

  const response = await fetch(`${baseURL}/user`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.value}`
    },
  });

  // await sleep(5000);

  const responseBody = await response.json() as UserListAPI;
  return responseBody;
}

export default async function IndexPage() {
  const users = await getInitialUsers();

  return (
    <main>
      <h1 className='text-xl font-medium text-gray-700'>Users</h1>
      <p className='text-gray-500'>A list of users retrieved from a database.</p>
      <Container initialTableData={users?.data} />
    </main>
  );
}