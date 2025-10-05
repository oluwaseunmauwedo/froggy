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
import { use, useEffect, useState } from "react";
import { consumeProjectPrompt } from "@/lib/utils";

export default function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const [input, setInput] = useState("");
  const [hasInitialized, setHasInitialized] = useState(false);
  const { messages, sendMessage, status } = useChat();

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
    <div className="flex flex-col h-full">
      <Conversation className="flex-1">
        <ConversationContent>
          {messages.map((message) => {
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
        <PromptForm value={input} onChange={setInput} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
