"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import { Loader } from "@/components/ai-elements/loader";
import { PromptForm } from "@/components/prompt-form";
import { useChat } from "@ai-sdk/react";
import { useEffect, useState } from "react";
import { consumeProjectPrompt } from "@/lib/utils";
import { DefaultChatTransport } from "ai";
import { ActivityCard } from "@/components/activity-card";
import { ActivityPanel } from "@/components/activity-panel";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { ChatMessage } from "@/lib/types";

interface ChatProps {
  projectId: string;
  initialMessages: ChatMessage[];
}

interface ActivityData {
  messageIndex: number;
  partIndex: number;
  name: string;
  code: string;
  activityId: string | null;
}

export function Chat({ projectId, initialMessages }: ChatProps) {
  const [input, setInput] = useState("");
  const [hasInitialized, setHasInitialized] = useState(false);
  const [openActivityId, setOpenActivityId] = useState<string | null>(null);

  const { messages, sendMessage, status } = useChat<ChatMessage>({
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest(request) {
        return {
          body: {
            projectId,
            message: request.messages.at(-1),
            ...request.body,
          },
        };
      },
    }),
  });

  console.log("Messages", messages);
  console.log("Status", status);

  // Get activity by ID (messageIndex-partIndex)
  const getActivity = (activityId: string): ActivityData | null => {
    const [messageIndex, partIndex] = activityId.split("-").map(Number);
    const message = messages[messageIndex];
    if (!message) return null;

    const part = message.parts[partIndex];
    if (part?.type !== "tool-createActivity") return null;

    // Extract activityId from output
    const dbActivityId =
      part.output?.success && part.output?.content?.activityId
        ? part.output.content.activityId
        : null;

    return {
      messageIndex,
      partIndex,
      name: part.input?.name || "Untitled Activity",
      code: part.input?.code || "",
      activityId: dbActivityId,
    };
  };

  const openActivity = getActivity(openActivityId || "");
  // Activity is streaming if code field is null or state is not output-available
  const isActivityStreaming = openActivity
    ? (() => {
        const part =
          messages[openActivity.messageIndex]?.parts[openActivity.partIndex];
        if (part?.type !== "tool-createActivity") return false;
        return !part.input?.code || part.state !== "output-available";
      })()
    : false;

  // Handle initial prompt from localStorage
  useEffect(() => {
    if (!hasInitialized) {
      const initialPrompt = consumeProjectPrompt(projectId);

      if (initialPrompt) {
        // Send the initial prompt as the first message
        sendMessage({
          role: "user",
          parts: [
            {
              type: "text",
              text: initialPrompt,
            },
          ],
        });
      }
      setHasInitialized(true);
    }
  }, [projectId, hasInitialized, sendMessage]);

  const handleSubmit = () => {
    if (!input.trim()) return;

    sendMessage({
      role: "user",
      parts: [
        {
          type: "text",
          text: input,
        },
      ],
    });
    setInput("");
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      <ResizablePanel defaultSize={openActivity ? 50 : 100} minSize={30}>
        <div className="flex flex-col h-full">
          <Conversation className="flex-1">
            <ConversationContent
              className={
                openActivity ? "" : "max-w-2xl mx-auto flex flex-col gap-4"
              }
            >
              {messages.map((message, messageIndex) => {
                return (
                  <div key={message.id} className="flex flex-col gap-2">
                    {message.parts.map((part, partIndex) => {
                      switch (part.type) {
                        case "text":
                          return (
                            <div
                              key={`${message.id}-${partIndex}`}
                              className={
                                message.role === "user"
                                  ? "self-end bg-accent text-accent-foreground p-2 px-3 rounded-md w-fit"
                                  : ""
                              }
                            >
                              <Response>{part.text}</Response>
                            </div>
                          );
                        case "tool-createActivity":
                          const activityId = `${messageIndex}-${partIndex}`;
                          const activityName =
                            part.input?.name || "Creating activity...";
                          const isActivityStreaming =
                            !part.input?.code ||
                            part.state !== "output-available";

                          return (
                            <ActivityCard
                              key={`${message.id}-${partIndex}`}
                              name={activityName}
                              isStreaming={isActivityStreaming}
                              onClick={() => setOpenActivityId(activityId)}
                            />
                          );
                        default:
                          return null;
                      }
                    })}
                  </div>
                );
              })}
              {status === "submitted" && <Loader />}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          <div
            className={`p-4 ${openActivity ? "" : "max-w-2xl mx-auto w-full"}`}
          >
            <PromptForm
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </ResizablePanel>

      {openActivity && (
        <>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={30}>
            <ActivityPanel
              name={openActivity.name}
              code={openActivity.code}
              isStreaming={isActivityStreaming}
              projectId={projectId}
              activityId={openActivity.activityId}
              onClose={() => setOpenActivityId(null)}
            />
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
}
