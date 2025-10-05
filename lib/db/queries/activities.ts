import { eq, desc, and } from "drizzle-orm";
import { getDb } from "../index";
import { activities } from "../schema";

export type Activity = typeof activities.$inferSelect;
export type NewActivity = typeof activities.$inferInsert;

/**
 * Get all activities for a specific project
 */
export async function getActivitiesByProjectId(
  projectId: string,
  options?: { isPublished?: boolean }
): Promise<Activity[]> {
  const db = getDb();
  const conditions = [eq(activities.projectId, projectId)];

  if (options?.isPublished !== undefined) {
    conditions.push(eq(activities.isPublished, options.isPublished));
  }

  return db
    .select()
    .from(activities)
    .where(conditions.length > 1 ? and(...conditions) : conditions[0])
    .orderBy(desc(activities.createdAt));
}

/**
 * Get a single activity by ID
 */
export async function getActivityById(
  id: string,
  projectId?: string,
  options?: { isPublished?: boolean }
): Promise<Activity | null> {
  const db = getDb();
  const conditions = [eq(activities.id, id)];

  if (projectId) {
    conditions.push(eq(activities.projectId, projectId));
  }

  if (options?.isPublished !== undefined) {
    conditions.push(eq(activities.isPublished, options.isPublished));
  }

  const result = await db
    .select()
    .from(activities)
    .where(conditions.length > 1 ? and(...conditions) : conditions[0])
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Create a new activity
 */
export async function createActivity(
  data: Omit<NewActivity, "id" | "createdAt">
): Promise<Activity> {
  const db = getDb();
  const result = await db
    .insert(activities)
    .values({
      ...data,
      createdAt: new Date(),
    })
    .returning();
  return result[0];
}

/**
 * Update an existing activity
 */
export async function updateActivity(
  id: string,
  projectId: string,
  data: { name?: string; code?: string; isPublished?: boolean }
): Promise<Activity | null> {
  const db = getDb();

  // First verify the activity belongs to the project
  const existing = await getActivityById(id, projectId);
  if (!existing) {
    return null;
  }

  const result = await db
    .update(activities)
    .set(data)
    .where(eq(activities.id, id))
    .returning();

  return result[0];
}

/**
 * Delete an activity
 */
export async function deleteActivity(
  id: string,
  projectId: string
): Promise<boolean> {
  const db = getDb();

  // First verify the activity belongs to the project
  const existing = await getActivityById(id, projectId);
  if (!existing) {
    return false;
  }

  await db.delete(activities).where(eq(activities.id, id));
  return true;
}
