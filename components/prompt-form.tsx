"use client";

import { ArrowUp, Paperclip } from "lucide-react";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PromptFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function PromptForm({ value, onChange, onSubmit }: PromptFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <form className="[--radius:1.2rem]" onSubmit={handleSubmit}>
      <Field>
        <FieldLabel htmlFor="prompt" className="sr-only">
          Prompt
        </FieldLabel>
        <InputGroup>
          <InputGroupTextarea
            id="prompt"
            placeholder="Ask Froggy to make an activity, generate analytics, or something else..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <InputGroupAddon align="block-end" className="gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupButton
                  size="icon-sm"
                  className="rounded-full"
                  aria-label="Attach file"
                >
                  <Paperclip />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>Attach file</TooltipContent>
            </Tooltip>
            <InputGroupButton
              aria-label="Send"
              className="ml-auto rounded-full"
              variant="default"
              size="icon-sm"
            >
              <ArrowUp />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </form>
  );
}
