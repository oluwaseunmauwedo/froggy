import { z } from "zod";
import { tool } from "ai";
import { createActivity as createActivityQuery } from "@/lib/db/queries/activities";

export const createActivity = (projectId: string) =>
  tool({
    description: "Create an activity",
    inputSchema: z.object({
      name: z
        .string()
        .describe(
          "The name of the activity. Should be unique across all activities in this project."
        ),
      code: z.string().describe("The code of the activity"),
    }),
    execute: async ({ name, code }) => {
      try {
        const activity = await createActivityQuery({
          projectId,
          name,
          code,
          isPublished: false,
        });

        return {
          success: true,
          error: null,
          content: {
            activityId: activity.id,
            message: `Activity "${name}" created successfully`,
          },
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
          content: null,
        };
      }
    },
  });
