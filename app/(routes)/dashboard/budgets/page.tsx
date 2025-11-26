import React from 'react'
import DashboardHeader from '@/app/_components/dashboardheader'
import { EmptyDemo } from './empty'
import { dbCheck } from '@/app/_actions/dbCheck'
import { getBudgetList } from '@/app/_actions/budgetActions'
import { get } from 'http'
import { BudgetList } from './budgetList'
export default async function Budgets() {
  const isuserbudget = await dbCheck();
  console.log(`[PAGE RENDER] Conditional result (isuserbudget): ${isuserbudget}`);
  
  let getbudget: any = [];

  if (isuserbudget == true){
    getbudget = await getBudgetList();
  }
  console.log(`[BUDGET LIST FETCH] : ${getbudget}`);
  
  return (
    <div className='w-285'>
      <DashboardHeader />
      { isuserbudget ? (
          <div className='mt-10 px-5 gap-6'>
          <BudgetList budgetList={getbudget}/>
          
          </div>
      ) : (
        <div className='mt-25'>
        <EmptyDemo />
        </div>
      )}
  
    </div>
  )
}