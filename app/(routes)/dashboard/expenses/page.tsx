import DashboardHeader from '@/app/_components/dashboardheader'
import { ExpenseListTable } from '@/components/expenseListData'
import { getAllExpenses } from '@/app/_actions/expenseActions'
import React from 'react'

const Expenses2 = async () => {
  const expenses = await getAllExpenses();
  return (
    <div className='w-285 flex-1'>
      <DashboardHeader />
      <div className='pl-6 pt-8'>
        <h2 className='font-bold text-3xl'>
          Expenses List
        </h2>
        <p className='text-gray-500 mt-2 pb-6'>
          Check your expenses right here
        </p>
      </div>
      <ExpenseListTable expenses={expenses} />
    </div>
  )
}

export default Expenses2