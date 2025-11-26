'use server'

import React from 'react'
import { db } from "@/db";
import { budgetTable } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import { eq, count } from 'drizzle-orm';
export async function dbCheck(): Promise<boolean> {
  try {
    const user = await currentUser();

    if (!user){
        return false
    }

    const email = user.emailAddresses[0].emailAddress
    console.log(`[CHECK BUDGET] Checking budget for user: ${email}`);

    const result = await db.select({count: count(budgetTable.id)}).from(budgetTable).where(eq(budgetTable.createdBy, email))

    const bcount = result[0]?.count || 0

    return bcount > 0;

  } catch (error) {
    console.error("Error checking budget existence", error);
    return false;
  }
}