import { getDb } from "@/lib/db";
import { activityEvents } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

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
