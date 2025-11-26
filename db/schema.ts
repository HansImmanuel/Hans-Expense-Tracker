import { integer, pgTable, varchar, serial, boolean, timestamp, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const usersTable = pgTable("users", {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  age: integer('age').notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  notes: text('notes'),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
});

export const budgetTable = pgTable('budgets', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    name: varchar('name', { length: 255 }).notNull(),
    amount: varchar('amount').notNull(),
    icon: varchar('icon'),
    createdBy: varchar('createdBy').notNull(),
})

export const expensestable = pgTable('expenses', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    amount: varchar('amount').notNull(),
    budgetID: integer('budgetID').references(()=>budgetTable.id),
    createdAt: timestamp('createdAt', {mode: 'date'}).defaultNow(),
})