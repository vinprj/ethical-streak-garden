
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
        "transition-all duration-700", 
        isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        "hover:shadow-lg hover:border-primary/50 transform-gpu"
      )}
      style={{ transitionDelay }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription className="text-sm mt-1">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
};
