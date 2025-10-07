import { getDb } from "@/lib/db";
import { activityEvents } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export type ActivityEvent = typeof activityEvents.$inferSelect;
export type NewActivityEvent = typeof activityEvents.$inferInsert;

export async function addActivityEvent(
  data: Omit<NewActivityEvent, "id" | "createdAt">
): Promise<ActivityEvent> {
  const db = getDb();
  const [event] = await db
    .insert(activityEvents)
    .values({
      ...data,
      createdAt: new Date(),
    })
    .returning();
  return event;
}

export async function getActivityEvents(
  activityId: string
): Promise<ActivityEvent[]> {
  const db = getDb();
  return db
    .select()
    .from(activityEvents)
    .where(eq(activityEvents.activityId, activityId))
    .orderBy(desc(activityEvents.createdAt));
}

export async function queryActivityEvents(
  activityId: string,
  sqlQuery: string
): Promise<any[]> {
  const db = getDb();

  // Basic SQL injection protection - ensure query references activityEvents table
  const lowerQuery = sqlQuery.toLowerCase();
  if (!lowerQuery.includes('activityevents') && !lowerQuery.includes('"activityevents"')) {
    throw new Error('Query must reference the activityEvents table');
  }

  // Replace the activityId placeholder with the actual value
  const safeSqlQuery = sqlQuery.replace(/\$ACTIVITY_ID/g, activityId);

  // Execute the raw SQL query using sql template
  const results = await db.execute(sql.raw(safeSqlQuery));

  return results.rows as any[];
}
