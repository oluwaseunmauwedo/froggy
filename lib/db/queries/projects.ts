import { eq, desc } from "drizzle-orm";
import { getDb } from "../index";
import { projects } from "../schema";

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

/**
 * Get all projects for a specific user
 */
export async function getProjectsByUserId(userId: string): Promise<Project[]> {
  const db = getDb();
  return db
    .select()
    .from(projects)
    .where(eq(projects.createdBy, userId))
    .orderBy(desc(projects.createdAt));
}

/**
 * Get a single project by ID
 */
export async function getProjectById(
  id: string,
  userId: string
): Promise<Project | null> {
  const db = getDb();
  const result = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);

  // Verify the project belongs to the user
  if (result.length > 0 && result[0].createdBy === userId) {
    return result[0];
  }

  return null;
}

/**
 * Create a new project
 */
export async function createProject(
  data: Omit<NewProject, "id" | "createdAt" | "updatedAt">
): Promise<Project> {
  const db = getDb();
  const result = await db.insert(projects).values(data).returning();
  return result[0];
}

/**
 * Update an existing project
 */
export async function updateProject(
  id: string,
  userId: string,
  data: { name: string }
): Promise<Project | null> {
  const db = getDb();

  // First verify the project belongs to the user
  const existing = await getProjectById(id, userId);
  if (!existing) {
    return null;
  }

  const result = await db
    .update(projects)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id))
    .returning();

  return result[0];
}

/**
 * Delete a project
 */
export async function deleteProject(
  id: string,
  userId: string
): Promise<boolean> {
  const db = getDb();

  // First verify the project belongs to the user
  const existing = await getProjectById(id, userId);
  if (!existing) {
    return false;
  }

  await db.delete(projects).where(eq(projects.id, id));
  return true;
}
