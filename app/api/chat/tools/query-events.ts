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
      description: z
        .string()
        .describe(
          "A short, user-friendly description of what this query is analyzing (e.g., 'Student completion rates', 'Average time spent per question')"
        ),
      sqlQuery: z
        .string()
        .describe(
          "SQL query to run against the activityEvents table. Use $ACTIVITY_ID placeholder for the activity ID. Table columns: id, activityId, event, data (jsonb), createdAt. Example: SELECT data->>'userName' as student, event, \"createdAt\" FROM \"activityEvents\" WHERE \"activityId\" = '$ACTIVITY_ID' ORDER BY \"createdAt\" ASC"
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
