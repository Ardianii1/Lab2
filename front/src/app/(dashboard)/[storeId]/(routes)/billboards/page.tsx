import React from 'react'
import BillboardClient from './components/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const metadata = {
  title: "Billboards",
  description: "Billboards for the store",
};
const BillboardsPage = async () => {
  const session = await getServerSession(authOptions);
  return (
    <div className='flex-col px-4'>
        <div className='flex-1 space-y-4p-8 pt-6'>
            <BillboardClient
            //@ts-ignore
            user={session?.user} />
        </div>
    </div>
  )
}

export default BillboardsPage