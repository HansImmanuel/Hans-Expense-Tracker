import React from 'react'
import DashboardHeader from '@/app/_components/dashboardheader'
import { getBudgetInfo } from '@/app/_actions/budgetActions'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { addExpense } from '@/app/_actions/expenseActions';
import { viewExpense } from '@/app/_actions/expenseActions';
import { ExpenseListTable } from '@/components/expenseListData';

export default async function Expenses({ params }: { params: Promise<{ id: string }> }) {
  const resolved = await params;
  const id = resolved.id;

  console.log("ID:", id);

  const budgetData = await getBudgetInfo(id);

  if (!Array.isArray(budgetData) || budgetData.length === 0) {
    let errorMessage = "Budget not found or an unknown error occurred.";

    if (budgetData && typeof budgetData === 'object' && 'success' in budgetData && budgetData.success === false) {
      errorMessage = budgetData.message;
    }

    return (
      <div className='w-full overflow-x-hidden'>
        <DashboardHeader />
        <div className="text-center mt-10 p-5 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p className="font-semibold">Error Loading Budget:</p>
          <p>{errorMessage}</p>
        </div>
      </div>
    );
  }

  const budgetd = budgetData[0];

  const formatCurrency = (value: number | undefined | null) => {
    const numericValue = Number(value ?? 0);
    return `Rp. ${numericValue.toLocaleString('en-US')}`;
  };
  const progressPercent = (Number(budgetd.totalSpend) / Number(budgetd.amount) * 100);
  const widthStyle = Math.min(Math.max(progressPercent, 0), 100) + '%';

  const expenses = await viewExpense(Number(budgetd.id))
  const totalItems = expenses.length;


  return (
    <div className='w-285 flex-1'>
      <DashboardHeader />
      <div className='pl-6 pt-8'>
        <h2 className='font-bold text-3xl'>
          My Expenses
        </h2>
      </div>
      <div className="w-281 pl-6 justify gap-5.5 mt-3 flex">
        <div className="w-122 p-4 h-40 border rounded-lg shadow-sm hover:shadow-lg transition-shadow bg-white">
          <div className="flex justify-between items-start">

            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-gray-100">

                <div className="text-3xl">{budgetd.icon}</div>
              </div>
              <div>
                <div className="text-lg font-semibold">{budgetd.name}</div>

                <div className="text-sm text-gray-500">{totalItems} Item(s)</div>
              </div>
            </div>

            <div className="text-xl font-bold text-indigo-700">
              {formatCurrency(Number(budgetd.amount))}
            </div>
          </div>

          <div className="mt-5">
            <div className='flex justify-between items-center pb-1.5 pt-2'>
              <p className="text-xs text-gray-500 mb-1">{formatCurrency(budgetd.totalSpend)} Spent</p>
              <p className='text-xs text-gray-500 mb-1'>{formatCurrency(Number(budgetd.amount) - Number(budgetd.totalSpend))} Remaining</p>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full"
                style={{ width: widthStyle }}
              ></div>
            </div>
          </div>
        </div>


        <form
          action={addExpense}
          className='w-138 p-4 border rounded-lg shadow-sm hover:shadow-lg transition-shadow bg-white'
        >
          <div className='text-xl pt-0.5 font-bold ml-4'>
            Add Expense
            <br />
            <div className="w-122 h-[1px] bg-gray-200 my-4" />
          </div>
          <input type="hidden" name="budgetID" value={id} />
          <div className='font-semibold text-lg ml-4 pb-1'>
            Expense Name
          </div>
          <Input type='text' placeholder='e.g Spotify Subscription' className='w-122 ml-4' name='name' required />
          <div className='font-semibold text-lg pt-2 ml-4 pb-1'>
            Expense Amount
          </div>
          <Input type='number' placeholder='Counted in IDR' className='w-122 ml-4' name='amount' required />
          <div className='ml-4 pt-8 flex justify-center mr-4'>
            <Button type='submit' className='w-full'>Add New Expense</Button>
          </div>
        </form>

      </div>

      <div className='pt-4 pl-6 pr-10'>
        <div className='pb-2 font-bold text-2xl'>
          Latest Expenses
        </div>
        <ExpenseListTable expenses={expenses} />
      </div>
    </div>

  )
}
