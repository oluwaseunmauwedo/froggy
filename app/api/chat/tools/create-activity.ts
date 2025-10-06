import { z } from "zod";
import { tool } from "ai";

export const createActivity = tool({
  description: "Create an activity",
  inputSchema: z.object({
    name: z
      .string()
      .describe(
        "The name of the activity. Should be unique across all activities in this project."
      ),
    code: z.string().describe("The code of the activity"),
  }),
  execute: ({ name }) => {
    return {
      success: true,
      error: null,
      message: `Activity "${name}" created successfully`,
    };
  },
});
