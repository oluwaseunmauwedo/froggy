import { eq } from "drizzle-orm";
import { getDb } from "../index";
import { messages } from "../schema";

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export async function addMessages(
  data: Omit<NewMessage, "id" | "createdAt">[]
): Promise<Message[]> {
  const db = getDb();

  const result = await db
    .insert(messages)
    .values(
      data.map((item) => ({
        ...item,
        createdAt: new Date(),
      }))
    )
    .returning();

  return result;
}

export async function getMessagesByProjectId(
  projectId: string
): Promise<Message[]> {
  const db = getDb();
  return db
    .select()
    .from(messages)
    .where(eq(messages.projectId, projectId))
    .orderBy(messages.createdAt);
}
