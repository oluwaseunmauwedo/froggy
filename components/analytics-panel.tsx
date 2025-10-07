"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface AnalyticsPanelProps {
  name: string;
  code: string;
  isStreaming: boolean;
  onClose: () => void;
}

export function AnalyticsPanel({
  name,
  code,
  isStreaming,
  onClose,
}: AnalyticsPanelProps) {
  return (
    <div className="h-full bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between py-1 px-3 border-b">
        <h2 className="font-semibold text-lg">{name}</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {isStreaming ? (
          <pre className="text-xs py-2 px-3 whitespace-pre-wrap">{code}</pre>
        ) : (
          <iframe
            srcDoc={code}
            className="w-full h-full"
            sandbox="allow-scripts allow-same-origin"
            title={name}
          />
        )}
      </div>
    </div>
  );
}
