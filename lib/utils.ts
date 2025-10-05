import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Utility functions for managing project initial prompts in localStorage
 */

const getProjectPromptKey = (projectId: string) => `froggy-project-${projectId}-initial-prompt`;

/**
 * Save an initial prompt for a project
 */
export function saveProjectPrompt(projectId: string, prompt: string): void {
  const key = getProjectPromptKey(projectId);
  localStorage.setItem(key, prompt);
}

/**
 * Get the initial prompt for a project
 */
export function getProjectPrompt(projectId: string): string | null {
  const key = getProjectPromptKey(projectId);
  return localStorage.getItem(key);
}

/**
 * Delete the initial prompt for a project
 */
export function deleteProjectPrompt(projectId: string): void {
  const key = getProjectPromptKey(projectId);
  localStorage.removeItem(key);
}

/**
 * Get and delete the initial prompt for a project in one operation
 */
export function consumeProjectPrompt(projectId: string): string | null {
  const prompt = getProjectPrompt(projectId);
  if (prompt) {
    deleteProjectPrompt(projectId);
  }
  return prompt;
}
