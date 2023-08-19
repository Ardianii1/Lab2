import React from 'react'
import OrderClient from './components/client'

const OrdersPage = () => {
  return (
    <div className='flex-col px-4'>
        <div className='flex-1 space-y-4p-8 pt-6'>
            <OrderClient />
        </div>
    </div>
  )
}

export default OrdersPage