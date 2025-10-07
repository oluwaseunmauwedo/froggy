import { tool } from "ai";
import { z } from "zod";
import { queryActivityEvents } from "@/lib/db/queries/activity-events";

export const queryEvents = (projectId: string) =>
  tool({
    description:
      "Query activity events using SQL to analyze student behavior, performance, and learning patterns. Use this to answer analytical questions about how students interacted with an activity.",
    inputSchema: z.object({
      activityId: z
        .string()
        .describe("The ID of the activity to query events for"),
      sqlQuery: z
        .string()
        .describe(
          "SQL query to run against the activityEvents table. The table has columns: id, activityId, event, data (jsonb), createdAt. Use SQL to filter, aggregate, and analyze events. Example: SELECT event, COUNT(*) as count FROM activityEvents WHERE activityId = $1 GROUP BY event"
        ),
    }),
    execute: async ({ activityId, sqlQuery }) => {
      try {
        const results = await queryActivityEvents(activityId, sqlQuery);
        return {
          success: true,
          error: null,
          content: {
            results,
            message: `Query executed successfully. Found ${results.length} results.`,
          },
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        return {
          success: false,
          error: errorMessage,
          content: {
            results: [],
            message: `Query failed: ${errorMessage}`,
          },
        };
      }
    },
  });
