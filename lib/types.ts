import { createActivity } from "@/app/api/chat/tools/create-activity";
import { InferUITool, UIDataTypes, UIMessage } from "ai";
import { z } from "zod";

export const messageMetadataSchema = z.object({
  createdAt: z.string(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

type createActivityTool = InferUITool<ReturnType<typeof createActivity>>;

export type ChatTools = {
  createActivity: createActivityTool;
};

export type ChatMessage = UIMessage<MessageMetadata, UIDataTypes, ChatTools>;
