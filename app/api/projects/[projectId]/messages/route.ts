import { getMessagesByProjectId } from "@/lib/db/queries/messages";
import { convertDBMessagesToModelMessages } from "@/lib/utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;

  try {
    const dbMessages = await getMessagesByProjectId(projectId);
    const messages = convertDBMessagesToModelMessages(dbMessages);

    return Response.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return Response.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
