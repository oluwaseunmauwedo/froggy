import { addMessages, getMessagesByProjectId } from "@/lib/db/queries/messages";
import { convertDBMessagesToModelMessages } from "@/lib/utils";
import { anthropic } from "@ai-sdk/anthropic";
import {
  convertToModelMessages,
  createUIMessageStream,
  JsonToSseTransformStream,
  smoothStream,
  streamText,
  UIMessage,
} from "ai";
import { createActivity } from "./tools/create-activity";
import { getProjectById } from "@/lib/db/queries/projects";
import { auth } from "@clerk/nextjs/server";
import { SYSTEM_PROMPT } from "./prompts";

export const maxDuration = 5 * 60;

type RequestBody = {
  message: UIMessage;
  projectId: string;
};

export async function POST(req: Request) {
  const { message, projectId }: RequestBody = await req.json();

  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project = await getProjectById(projectId, userId);
  if (!project) {
    return Response.json(
      { error: "Project not found or unauthorized" },
      { status: 404 }
    );
  }

  const dbMessages = await getMessagesByProjectId(projectId);
  const messages = convertDBMessagesToModelMessages(dbMessages);

  // Add the user message to the database
  await addMessages([
    {
      projectId,
      role: message.role,
      parts: message.parts,
      attachments: [],
    },
  ]);

  const stream = createUIMessageStream({
    execute: ({ writer: dataStream }) => {
      const result = streamText({
        model: anthropic("claude-sonnet-4-5-20250929"),
        system: SYSTEM_PROMPT,
        messages: convertToModelMessages([...messages, message]),
        // experimental_transform: smoothStream({ chunking: "word" }),
        tools: {
          createActivity,
        },
      });

      result.consumeStream();

      dataStream.merge(
        result.toUIMessageStream({
          sendReasoning: true,
        })
      );
    },
    onFinish: async ({ messages }) => {
      await addMessages(
        messages.map((message) => ({
          projectId,
          role: message.role,
          parts: message.parts,
          attachments: [],
        }))
      );
    },
  });

  return new Response(stream.pipeThrough(new JsonToSseTransformStream()));
}
