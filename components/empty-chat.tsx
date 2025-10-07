"use client";

import Image from "next/image";

interface EmptyChatProps {
  onPromptClick: (prompt: string) => void;
}

const PROMPT_SUGGESTIONS = [
  "Create a water cycle labeling activity",
  "Make a space exploration game",
  "Build a quiz on world capitals",
  "Generate a game to learn fractions",
];

export function EmptyChat({ onPromptClick }: EmptyChatProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto px-4">
      <div className="mb-8">
        <Image
          src="/froggy-transparent-bg.png"
          alt="Froggy"
          width={120}
          height={120}
          className="opacity-80"
        />
      </div>

      <h2 className="text-2xl font-semibold mb-2">
        What would you like to create?
      </h2>
      <p className="text-muted-foreground text-center mb-8">
        Start by describing an activity or choose a suggestion below
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
        {PROMPT_SUGGESTIONS.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onPromptClick(prompt)}
            className="cursor-pointer px-3 py-2 text-left rounded-lg border border-border hover:bg-accent hover:border-accent-foreground/20 transition-all duration-200 text-sm"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
