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
import { DefaultChatTransport, UIMessage } from "ai";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
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

  // console.log("Messages", messages);

  // Get activity by ID (messageIndex-partIndex)
  const getActivity = (activityId: string): ActivityData | null => {
    const [messageIndex, partIndex] = activityId.split("-").map(Number);
    const message = messages[messageIndex];
    if (!message) return null;

    const part = message.parts[partIndex];
    if (part?.type !== "tool-createActivity") return null;

    return {
      messageIndex,
      partIndex,
      name: part.input?.name || "Untitled Activity",
      code: part.input?.code || "",
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
            <ConversationContent>
              {messages.map((message, messageIndex) => {
                return (
                  <div key={message.id}>
                    {message.parts.map((part, partIndex) => {
                      switch (part.type) {
                        case "text":
                          return (
                            <Message
                              key={`${message.id}-${partIndex}`}
                              from={message.role}
                            >
                              <MessageContent>
                                <Response>{part.text}</Response>
                              </MessageContent>
                            </Message>
                          );
                        case "tool-createActivity":
                          const activityId = `${messageIndex}-${partIndex}`;
                          const activityName =
                            part.input?.name || "Creating activity...";

                          return (
                            <ActivityCard
                              key={`${message.id}-${partIndex}`}
                              name={activityName}
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

          <div className="p-4">
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
              onClose={() => setOpenActivityId(null)}
            />
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
}
