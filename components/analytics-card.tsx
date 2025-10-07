"use client";

import { Card } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

interface AnalyticsCardProps {
  name: string;
  isStreaming: boolean;
  onClick: () => void;
}

export function AnalyticsCard({
  name,
  isStreaming,
  onClick,
}: AnalyticsCardProps) {
  return (
    <Card
      className={`p-4 cursor-pointer hover:bg-purple-500/5 transition-all duration-300 shadow-none border-[0.5px] ${
        isStreaming ? "border-purple-500/30" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-purple-500/10">
          <BarChart3 className="h-5 w-5 text-purple-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm leading-tight line-clamp-1">
            {name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {isStreaming ? "Generating analytics..." : "Analytics dashboard"}
          </p>
        </div>
      </div>
    </Card>
  );
}
