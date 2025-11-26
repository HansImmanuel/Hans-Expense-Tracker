'use client'

import React, { useState, useEffect } from 'react'
import { Icon } from 'lucide-react'
import { BudgetItemCard } from '@/components/budgetItemCard'
import { EmptyDemo2 } from '@/components/empty2'

export function BudgetList({budgetList}: any) {

  return (
    <div className='mt-7'>
        <div className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3'>
            <div className=''>
              <EmptyDemo2 />
            </div>
            {budgetList?.map((item: any) => (
              <BudgetItemCard key={item.id} item={item} />
            ))}
        </div>
    </div>
  )
}


