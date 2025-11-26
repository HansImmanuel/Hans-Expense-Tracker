'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { viewExpense } from '@/app/_actions/expenseActions';
import { deleteBudget, updateBudget } from '@/app/_actions/budgetActions';
import { Trash, Edit, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import EmojiPicker from 'emoji-picker-react';

interface BudgetItem {
  id: number;
  icon: string
  name: string;
  amount: string;
  totalSpend: number;
  totalItem: number;
}

export function BudgetItemCard({ item }: { item: BudgetItem }) {
  const router = useRouter();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editAmount, setEditAmount] = useState(item.amount);
  const [editIcon, setEditIcon] = useState(item.icon);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (value: number | string | undefined | null) => {
    const numericValue = Number(value ?? 0);
    return `Rp. ${numericValue.toLocaleString('id-ID')}`;
  };

  const handleCardClick = () => {
    router.push(`/dashboard/expenses/${item.id}`)
  }

  useEffect(() => {
    async function api() {
      const exresult = await viewExpense(item.id);
      setExpenses(exresult);
    }
    api();
  }, [item.id])

  const totalSpent = expenses.reduce((acc, exp) => {
    return acc + Number(exp.amount);
  }, 0);

  const progressPercent = (totalSpent / Number(item.amount)) * 100;
  const widthStyle = Math.min(Math.max(progressPercent, 0), 100) + '%';

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this budget and all its expenses?")) {
      const result = await deleteBudget(item.id);
      if (result?.success) {
        toast("Budget deleted successfully");
      } else {
        toast("Failed to delete budget");
      }
    }
  }

  const handleUpdate = async () => {
    setIsLoading(true);
    const result = await updateBudget(item.id, editName, editAmount, editIcon);
    setIsLoading(false);
    if (result?.success) {
      toast("Budget updated successfully");
      setIsEditOpen(false);
    } else {
      toast("Failed to update budget");
    }
  }

  return (
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-lg transition-shadow cursor-pointer bg-white relative group"
      onClick={handleCardClick}
      role='button'
      tabIndex={0}
    >
      <div className="absolute top-10 right-2 flex gap-2">
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
              onClick={(e) => { e.stopPropagation(); }}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent onClick={(e) => e.stopPropagation()} className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Edit Budget</DialogTitle>
              <DialogDescription>
                Make changes to your budget here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Button variant="outline" className="col-span-1 h-12 text-2xl" onClick={() => setOpenEmojiPicker(!openEmojiPicker)}>
                  {editIcon}
                </Button>
                <div className="col-span-3 relative">
                  {openEmojiPicker && (
                    <div className="absolute z-10 top-full left-0">
                      <EmojiPicker onEmojiClick={(e) => {
                        setEditIcon(e.emoji);
                        setOpenEmojiPicker(false);
                      }} />
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleUpdate} disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : "Save changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={handleDelete}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-gray-100">
            <p className="text-3xl">{item.icon}</p>
          </div>
          <div>
            <p className="text-lg font-semibold">{item.name}</p>
            <p className="text-sm text-gray-500">{expenses.length} Item(s)</p>
          </div>
        </div>

        <p className="text-md font-bold text-indigo-700">
          {formatCurrency(item.amount)}
        </p>
      </div>

      <div className="mt-5">
        <div className='flex justify-between items-center pb-0.5 pt-2'>
          <p className="text-xs text-gray-500 mb-1">{formatCurrency(totalSpent)} Spent</p>
          <p className='text-xs text-gray-500 mb-1'>{formatCurrency(Number(item.amount) - totalSpent)} Remaining</p>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: widthStyle }}
          ></div>
        </div>
      </div>
    </div>
  );
}