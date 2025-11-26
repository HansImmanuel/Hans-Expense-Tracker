// app/_actions/budgetActions.ts
'use server'

import { db } from "@/db";
import { budgetTable, expensestable } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import { and, getTableColumns, sql } from "drizzle-orm";
import { eq } from "drizzle-orm";

export async function createBudget(name: string, amount: string, icon: string) {
    try {
        const user = await currentUser();

        if (!user) {
            return {
                success: false, message:
                    "User not found / Unauthorized"
            }
        }

        const result = await db.insert(budgetTable).values({
            name: name,
            amount: amount,
            icon: icon,
            createdBy: user.emailAddresses[0].emailAddress,
        }).returning();

        revalidatePath('/');

        return { success: true };

    } catch (error) {
        console.error("Error inserting budget:", error);
        return { success: false, message: "DB Error" };
    }
}

export async function getBudgetList() {
    try {
        const user = await currentUser();

        if (!user) {
            return {
                success: false, message:
                    "User not found / Unauthorized"
            }
        }

        const result = await db.select({
            ...getTableColumns(budgetTable),
            totalSpend: sql`coalesce(sum(${expensestable.amount}::int), 0)`.mapWith(Number),
            totalItem: sql`coalesce(count(${expensestable.id}), 0)`.mapWith(Number)
        })
            .from(budgetTable)
            .leftJoin(expensestable, eq(budgetTable.id, expensestable.budgetID))
            .where(eq(budgetTable.createdBy, user.emailAddresses[0].emailAddress))
            .groupBy(budgetTable.id)

        console.log(result)

        return result;

    } catch (error) {
        console.error("Error getting budget:", error);
        return { success: false, message: "DB Error" };
    }
}

export async function getBudgetInfo(budgetIdString: string) {
    try {
        const user = await currentUser();

        if (!user) {
            return {
                success: false, message:
                    "User not found / Unauthorized"
            }
        }

        const budgetId = Number(budgetIdString);

        if (isNaN(budgetId)) {
            return { success: false, message: "Invalid Budget ID format (Not a Number)." };
        }

        const result = await db.select({
            ...getTableColumns(budgetTable),
            totalSpend: sql`coalesce(sum(${expensestable.amount}::int), 0)`.mapWith(Number),
            totalItem: sql`coalesce(count(${expensestable.id}), 0)`.mapWith(Number)
        })
            .from(budgetTable)
            .leftJoin(expensestable, eq(budgetTable.id, expensestable.budgetID))
            .where(and(
                eq(budgetTable.createdBy, user.emailAddresses[0].emailAddress),
                eq(budgetTable.id, budgetId)
            ))
            .groupBy(budgetTable.id)

        return result;

    } catch (error) {
        console.error("Error getting budget info:", error);
        return { success: false, message: "DB Error" };
    }
}

export async function deleteBudget(budgetId: number) {
    const user = await currentUser();
    if (!user) return { success: false, message: "Unauthorized" };

    try {
        // Verify ownership
        const budget = await db.select().from(budgetTable).where(and(
            eq(budgetTable.id, budgetId),
            eq(budgetTable.createdBy, user.emailAddresses[0].emailAddress)
        ));

        if (budget.length === 0) return { success: false, message: "Budget not found or unauthorized" };

        // Delete associated expenses first (if not cascading)
        await db.delete(expensestable).where(eq(expensestable.budgetID, budgetId));

        // Delete budget
        await db.delete(budgetTable).where(eq(budgetTable.id, budgetId));

        revalidatePath('/dashboard');
        revalidatePath('/dashboard/budgets');
        return { success: true };
    } catch (error) {
        console.error("Error deleting budget:", error);
        return { success: false, message: "DB Error" };
    }
}

export async function updateBudget(budgetId: number, name: string, amount: string, icon: string) {
    const user = await currentUser();
    if (!user) return { success: false, message: "Unauthorized" };

    try {
        // Verify ownership
        const budget = await db.select().from(budgetTable).where(and(
            eq(budgetTable.id, budgetId),
            eq(budgetTable.createdBy, user.emailAddresses[0].emailAddress)
        ));

        if (budget.length === 0) return { success: false, message: "Budget not found or unauthorized" };

        await db.update(budgetTable).set({
            name,
            amount,
            icon
        }).where(eq(budgetTable.id, budgetId));

        revalidatePath('/dashboard');
        revalidatePath('/dashboard/budgets');
        revalidatePath(`/dashboard/expenses/${budgetId}`);
        return { success: true };
    } catch (error) {
        console.error("Error updating budget:", error);
        return { success: false, message: "DB Error" };
    }
}