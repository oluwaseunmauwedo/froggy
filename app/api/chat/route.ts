import { addMessage, getMessagesByProjectId } from "@/lib/db/queries/messages";
import { convertDBMessagesToModelMessages } from "@/lib/utils";
import { anthropic } from "@ai-sdk/anthropic";
import {
  convertToModelMessages,
  smoothStream,
  streamText,
  UIMessage,
} from "ai";

export const maxDuration = 5 * 60;

export async function POST(req: Request) {
  const { message, projectId }: { message: UIMessage; projectId: string } =
    await req.json();

  console.log("Message", message);
  console.log("Project ID", projectId);

  const dbMessages = await getMessagesByProjectId(projectId);
  const messages = convertDBMessagesToModelMessages(dbMessages);

  // Add the user message to the database
  await addMessage({
    projectId,
    role: message.role,
    parts: message.parts,
    attachments: [],
  });

  const result = streamText({
    model: anthropic("claude-3-5-sonnet-20240620"),
    system: "You are a helpful assistant.",
    messages: convertToModelMessages([...messages, message]),
    experimental_transform: smoothStream({ chunking: "word" }),
    onFinish: async (args) => {
      // Add the assistant message to the database
      await addMessage({
        projectId,
        role: "assistant",
        parts: args.content,
        attachments: [],
      });
    },
  });

  return result.toUIMessageStreamResponse();
}
