import { cookies } from 'next/headers';

import { baseURL } from '@/app/config';
import { MicroserviceListAPI } from '@/interface/microservice';
import Container from './container';

// const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function getMicroservices(): Promise<MicroserviceListAPI | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('access-token');

  if (!token) {
    console.log('inside');
    return null;
  } 

  const response = await fetch(`${baseURL}/microservice`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.value}`
    },
  });

  // await sleep(5000);

  const responseBody = await response.json() as MicroserviceListAPI;
  return responseBody;
}

export default async function IndexPage() {
  const microservices = await getMicroservices();

  return (
    <main>
      <Container initialData={microservices?.data || []} />
    </main>
  );
}