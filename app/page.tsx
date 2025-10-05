"use client";

import { PromptForm } from "@/components/prompt-form";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");

  const handleChange = (value: string) => {
    setPrompt(value);
  };

  const handleSubmit = () => {
    console.log(prompt);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-2xl">
        <PromptForm
          value={prompt}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
