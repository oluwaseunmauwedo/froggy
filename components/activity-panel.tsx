"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ActivityPanelProps {
  name: string;
  code: string;
  isStreaming: boolean;
  onClose: () => void;
}

export function ActivityPanel({
  name,
  code,
  isStreaming,
  onClose,
}: ActivityPanelProps) {
  return (
    <div className="h-full bg-background border-l flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold text-lg">{name}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {isStreaming ? (
          <div className="p-4">
            <div className="text-sm text-muted-foreground mb-2">
              Code is streaming...
            </div>
            <pre className="text-xs bg-muted p-4 rounded overflow-auto whitespace-pre-wrap">
              {code}
            </pre>
          </div>
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
