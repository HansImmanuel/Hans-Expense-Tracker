import React from 'react'
import DashboardHeader from '@/app/_components/dashboardheader'
import { getBudgetList } from '@/app/_actions/budgetActions'
import { getAllExpenses } from '@/app/_actions/expenseActions'
import { ExpenseListTable } from '@/components/expenseListData'
import BarChart from '@/components/BarChart'
import { currentUser } from '@clerk/nextjs/server'

async function Dashboard() {
  const user = await currentUser();
  const budgetList = await getBudgetList();
  const expenses = await getAllExpenses();

  // Calculate totals
  let totalBudget = 0;
  let totalSpend = 0;
  let noOfBudget = 0;

  if (Array.isArray(budgetList)) {
    noOfBudget = budgetList.length;
    budgetList.forEach(budget => {
      totalBudget += Number(budget.amount);
      totalSpend += Number(budget.totalSpend);
    });
  }

  const formatCurrency = (value: number) => {
    return `Rp. ${value.toLocaleString('id-ID')}`;
  };

  return (
    <div className='w-full'>
      <DashboardHeader />
      <div className='p-8'>
        <h2 className='font-bold text-3xl mb-5'>Hi, {user?.fullName || 'User'}!</h2>
        <p className='text-gray-500 mb-8'>Here's what's happening with your money, Let's Manage your expense</p>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mb-8'>
          <div className='p-5 border rounded-lg shadow-sm bg-white'>
            <h3 className='text-gray-500 text-sm font-semibold'>Total Budget</h3>
            <p className='text-2xl font-bold mt-2'>{formatCurrency(totalBudget)}</p>
          </div>
          <div className='p-5 border rounded-lg shadow-sm bg-white'>
            <h3 className='text-gray-500 text-sm font-semibold'>Total Spend</h3>
            <p className='text-2xl font-bold mt-2'>{formatCurrency(totalSpend)}</p>
          </div>
          <div className='p-5 border rounded-lg shadow-sm bg-white'>
            <h3 className='text-gray-500 text-sm font-semibold'>Number of Budget</h3>
            <p className='text-2xl font-bold mt-2'>{noOfBudget}</p>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
          <div className='md:col-span-2'>
            <BarChart />
          </div>
          <div className='md:col-span-1'>
            <div className='p-5 border rounded-lg shadow-sm bg-white h-full'>
              <h2 className='font-bold text-lg mb-4'>Latest Budgets</h2>
              {Array.isArray(budgetList) && budgetList.slice(0, 3).map((budget, index) => (
                <div key={index} className='flex justify-between items-center mb-4 last:mb-0'>
                  <div className='flex items-center gap-3'>
                    <div className='p-2 bg-slate-100 rounded-full text-xl'>
                      {budget.icon}
                    </div>
                    <div>
                      <h3 className='font-bold'>{budget.name}</h3>
                      <p className='text-xs text-gray-500'>{budget.totalItem} Items</p>
                    </div>
                  </div>
                  <div className='font-bold text-indigo-700'>
                    {formatCurrency(Number(budget.amount))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='mt-8'>
          <h2 className='font-bold text-lg mb-4'>Latest Expenses</h2>
          <ExpenseListTable expenses={expenses} />
        </div>

      </div>
    </div>
  )
}

export default Dashboard