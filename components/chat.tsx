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

interface ChatProps {
  projectId: string;
  initialMessages: UIMessage[];
}

export function Chat({ projectId, initialMessages }: ChatProps) {
  const [input, setInput] = useState("");
  const [hasInitialized, setHasInitialized] = useState(false);

  const { messages, sendMessage, status } = useChat({
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
                    case "tool-createActivity":
                      return (
                        <Tool key={`${message.id}-${partIndex}`}>
                          <ToolHeader type={part.type} state={part.state} />
                          <ToolContent>
                            <ToolInput input={part.input} />
                            <ToolOutput
                              errorText={part.errorText}
                              output={part.output}
                            />
                          </ToolContent>
                        </Tool>
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
