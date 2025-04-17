
import React, { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface InsightCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  isAnimated: boolean;
  transitionDelay?: string;
  children: ReactNode;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  title,
  description,
  icon: Icon,
  isAnimated,
  transitionDelay = "0ms",
  children
}) => {
  return (
    <Card 
      className={cn(
        "transition-all duration-500", 
        isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
      style={{ transitionDelay }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
};
