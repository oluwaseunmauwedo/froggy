import { eq, desc } from "drizzle-orm";
import { getDb } from "../index";
import { messages } from "../schema";

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export async function addMessage(
  data: Omit<NewMessage, "id" | "createdAt">
): Promise<Message> {
  const db = getDb();

  const result = await db
    .insert(messages)
    .values({
      ...data,
      createdAt: new Date(),
    })
    .returning();

  return result[0];
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
