import React from 'react'
import CategoryClient from './components/client'

const CategoriesPage = () => {
  return (
    <div className='flex-col px-4'>
        <div className='flex-1 space-y-4p-8 pt-6'>
            <CategoryClient />
        </div>
    </div>
  )
}

export default CategoriesPage