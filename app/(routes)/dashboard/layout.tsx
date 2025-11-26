'use client'

import React, { useEffect } from 'react'
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from '@/components/app-sidebar';
import { db } from '@/db/index';
import { budgetTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

function DashboardLayout({ children }: { children: React.ReactNode }) {

  const { user } = useUser()
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const checkUserBudgets = async () => {
      const result = await db
        .select()
        .from(budgetTable)
        .where(eq(budgetTable.createdBy, email));

      console.log(result);
      if (result?.length == 0) {
        router.replace('/dashboard/budgets')
      }
    };

    checkUserBudgets();
  }, [user]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout