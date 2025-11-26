import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "./db/migrations",

  driver: "pglite",
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_DATABASE_URL!,
  },

});
