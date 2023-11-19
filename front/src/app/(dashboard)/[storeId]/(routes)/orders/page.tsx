import React from 'react'
import OrderClient from './components/client'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
export const metadata = {
  title: "Orders",
  description: "Orders for the store",
};
const OrdersPage = async() => {
   const session = await getServerSession(authOptions);
  const user = session?.user;
  return (
    <div className='flex-col px-4'>
        <div className='flex-1 space-y-4p-8 pt-6'>
            <OrderClient
            //@ts-ignore
            user={user}/>
        </div>
    </div>
  )
}

export default OrdersPage