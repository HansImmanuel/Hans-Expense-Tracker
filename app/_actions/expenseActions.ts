'use server'

import { db } from "@/db";
import { budgetTable, expensestable } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { desc, eq, and } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export async function addExpense(formData: FormData) {
    const name = formData.get("name") as string;
    const amount = formData.get("amount") as string;
    const budgetID = formData.get("budgetID");

    await db.insert(expensestable).values({
        name,
        amount,
        budgetID: Number(budgetID),
    });

    revalidatePath(`/dashboard/expenses/${budgetID}`);
    redirect(`/dashboard/expenses/${budgetID}`);

}

export async function viewExpense(budgetID: Number | string) {
    const parsedID = Number(budgetID)
    const user = await currentUser();

    if (!user) {
        return [];
    }

    const budget = await db.select().from(budgetTable).where(and(
        eq(budgetTable.id, parsedID),
        eq(budgetTable.createdBy, user.emailAddresses[0].emailAddress)
    ));

    if (!budget || budget.length === 0) {
        return [];
    }

    const result = await db.select().from(expensestable).where(eq(expensestable.budgetID, parsedID)).orderBy(desc(expensestable.createdAt));

    return result;
}

export async function getAllExpenses() {
    const user = await currentUser();

    if (!user) {
        return [];
    }

    const result = await db.select({
        id: expensestable.id,
        name: expensestable.name,
        amount: expensestable.amount,
        createdAt: expensestable.createdAt,
        budgetID: expensestable.budgetID
    })
        .from(expensestable)
        .leftJoin(budgetTable, eq(expensestable.budgetID, budgetTable.id))
        .where(eq(budgetTable.createdBy, user.emailAddresses[0].emailAddress))
        .orderBy(desc(expensestable.createdAt));

    return result;
}

export async function deleteExpense(expenseId: number) {
    const user = await currentUser();
    if (!user) return;

    const expense = await db.select().from(expensestable).where(eq(expensestable.id, expenseId));
    if (expense.length === 0 || !expense[0].budgetID) return;

    const budget = await db.select().from(budgetTable).where(and(
        eq(budgetTable.id, expense[0].budgetID),
        eq(budgetTable.createdBy, user.emailAddresses[0].emailAddress)
    ));

    if (budget.length === 0) return;

    await db.delete(expensestable).where(eq(expensestable.id, expenseId));
    revalidatePath('/dashboard');
    revalidatePath(`/dashboard/expenses/${expense[0].budgetID}`);
}
