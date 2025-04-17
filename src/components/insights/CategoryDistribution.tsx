
import React from "react";
import { cn } from "@/lib/utils";

interface CategoryData {
  name: string;
  value: number;
}

interface CategoryDistributionProps {
  data: CategoryData[];
  isAnimated: boolean;
  getCategoryColor: (category: string) => string;
}

export const CategoryDistribution: React.FC<CategoryDistributionProps> = ({ 
  data, 
  isAnimated, 
  getCategoryColor 
}) => {
  return (
    <div className="h-[240px] flex items-center justify-center">
      {data.length > 0 ? (
        <div className="w-full flex flex-wrap justify-around items-center gap-2">
          {data.map((category, index) => (
            <div 
              key={category.name}
              className={cn(
                "flex flex-col items-center p-2 rounded-lg transition-all duration-500",
                isAnimated ? "opacity-100 scale-100" : "opacity-0 scale-95"
              )}
              style={{ 
                transitionDelay: `${200 + index * 100}ms`,
                borderLeft: `3px solid ${getCategoryColor(category.name.toLowerCase())}`
              }}
            >
              <div className="text-2xl font-bold">{category.value}</div>
              <div className="text-sm text-muted-foreground">{category.name}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          No habit categories found
        </div>
      )}
    </div>
  );
};
