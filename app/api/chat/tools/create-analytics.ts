import { tool } from "ai";
import { z } from "zod";

export const createAnalytics = (projectId: string) =>
  tool({
    description:
      "Create an analytics visualization for the educator to view. Generate HTML with charts, tables, and insights based on the analysis of student event data. This is only for the educator/creator to view, not for students.",
    inputSchema: z.object({
      name: z
        .string()
        .describe(
          "A descriptive name for this analytics view (e.g., 'Overall Student Performance', 'Individual Student Analysis - John')"
        ),
      code: z
        .string()
        .describe(
          "Complete HTML code with embedded CSS and JavaScript to visualize the analytics. Use Tailwind CSS for styling. Include charts, tables, summary statistics, and insights. No API access - all data should be embedded in the HTML."
        ),
    }),
    execute: async ({ name, code }) => {
      return {
        success: true,
        error: null,
        content: {
          message: `Analytics view "${name}" created successfully`,
        },
      };
    },
  });
