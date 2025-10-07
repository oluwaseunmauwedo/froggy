"use client";

import { Card } from "@/components/ui/card";
import { Code2, Loader2 } from "lucide-react";

interface ActivityCardProps {
  name: string;
  isStreaming: boolean;
  onClick: () => void;
}

export function ActivityCard({
  name,
  isStreaming,
  onClick,
}: ActivityCardProps) {
  return (
    <Card
      className={`w-fit p-2 cursor-pointer hover:bg-accent/50 transition-all duration-300 shadow-none border-[0.5px]}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-primary/10">
          {isStreaming ? (
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          ) : (
            <Code2 className="h-5 w-5 text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm leading-tight line-clamp-1">
            {name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {isStreaming ? "Generating..." : "Interactive activity"}
          </p>
        </div>
      </div>
    </Card>
  );
}
