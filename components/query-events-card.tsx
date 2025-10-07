"use client";

import { Card } from "@/components/ui/card";
import { Database, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface QueryEventsCardProps {
  activityId?: string;
  description?: string;
  sqlQuery?: string;
  results?: any[];
  isStreaming: boolean;
  state: string;
}

export function QueryEventsCard({
  activityId,
  description,
  sqlQuery,
  results,
  isStreaming,
  state,
}: QueryEventsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const resultCount = results?.length ?? 0;
  const hasCompleted = state === "output-available";

  return (
    <Card className="p-4 shadow-none border-[0.5px] mb-4 hover:bg-blue-500/5 transition-all duration-300">
      <div
        className="flex items-start gap-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="p-2 rounded-lg bg-blue-500/10 shrink-0">
          <Database className="h-4 w-4 text-blue-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-medium text-sm">
              {isStreaming
                ? "Querying database..."
                : description || "Database Query"}
            </h3>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
          </div>
          {hasCompleted && (
            <p className="text-xs text-muted-foreground">
              Found {resultCount} result{resultCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      {isExpanded && hasCompleted && (
        <div className="space-y-3">
          {/* SQL Query */}
          {sqlQuery && (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-1">
                Query Used
              </h4>
              <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                {sqlQuery}
              </pre>
            </div>
          )}

          {/* Results */}
          {results && results.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-1">
                Results ({resultCount})
              </h4>
              <div className="bg-muted p-2 rounded max-h-48 overflow-auto">
                <pre className="text-xs">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {results && results.length === 0 && (
            <p className="text-xs text-muted-foreground italic">
              No results found
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
