CREATE TABLE "expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"amount" varchar NOT NULL,
	"budgetID" integer,
	"createdBy" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_budgetID_budgets_id_fk" FOREIGN KEY ("budgetID") REFERENCES "public"."budgets"("id") ON DELETE no action ON UPDATE no action;