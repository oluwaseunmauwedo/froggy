"use client";

import { PromptForm } from "@/components/prompt-form";
import Image from "next/image";
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
    <div className="flex flex-col gap-8 items-center min-h-screen p-8">
      <div className="w-full max-w-2xl flex flex-col items-center justify-center">
        <Image
          src="/froggy-transparent-bg.png"
          alt="Froggy"
          width={100}
          height={100}
        />
        <h1 className="text-4xl font-bold">Froggy</h1>
      </div>

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
