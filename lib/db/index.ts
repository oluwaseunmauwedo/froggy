import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

// Function to create database connection with environment variable
export function createDb(databaseUrl: string) {
  const sql = neon(databaseUrl);
  return drizzle(sql, { schema });
}

// Helper function to get database instance for Next.js API routes
export function getDb() {
  return createDb(process.env.DATABASE_URL!);
}
