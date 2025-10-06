"use client";

import { Card } from "@/components/ui/card";
import { Code2 } from "lucide-react";

interface ActivityCardProps {
  name: string;
  onClick: () => void;
}

export function ActivityCard({ name, onClick }: ActivityCardProps) {
  return (
    <Card
      className="px-3 py-3 cursor-pointer hover:bg-accent transition-colors border-[0.5px] shadow-none w-fit"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Code2 className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm">{name}</h3>
          <p className="text-xs text-muted-foreground">Interactive activity</p>
        </div>
      </div>
    </Card>
  );
}
