"use client";

import { PromptForm } from "@/components/prompt-form";
import { useAuth } from "@clerk/nextjs";
import { useAuthDialogStore } from "@/store/auth-dialog-store";
import Image from "next/image";
import { useEffect, useState } from "react";

const PROMPT_STORAGE_KEY = "froggy-home-prompt";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const { isSignedIn } = useAuth();
  const { openSignIn } = useAuthDialogStore();

  // Load prompt from localStorage on mount
  useEffect(() => {
    const savedPrompt = localStorage.getItem(PROMPT_STORAGE_KEY);
    if (savedPrompt) {
      setPrompt(savedPrompt);
    }
  }, []);

  const handleChange = (value: string) => {
    setPrompt(value);
    // Persist to localStorage
    localStorage.setItem(PROMPT_STORAGE_KEY, value);
  };

  const handleSubmit = () => {
    if (!isSignedIn) {
      openSignIn();
      return;
    }
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
