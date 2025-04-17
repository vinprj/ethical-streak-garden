
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
        <div className="w-full flex flex-wrap justify-around items-center gap-3">
          {data.map((category, index) => (
            <div 
              key={category.name}
              className={cn(
                "flex flex-col items-center p-3 rounded-lg transition-all duration-700 bg-card shadow-sm",
                isAnimated ? "opacity-100 scale-100" : "opacity-0 scale-95"
              )}
              style={{ 
                transitionDelay: `${200 + index * 150}ms`,
                borderLeft: `3px solid ${getCategoryColor(category.name.toLowerCase())}`,
                transform: isAnimated ? "translateY(0)" : "translateY(10px)",
              }}
            >
              <div className="text-2xl font-bold">
                {isAnimated ? (
                  <CountUp end={category.value} duration={1.5} delay={0.2 + index * 0.1} />
                ) : (
                  category.value
                )}
              </div>
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

// Simple CountUp animation component
const CountUp = ({ 
  end, 
  duration = 1, 
  delay = 0 
}: { 
  end: number, 
  duration?: number, 
  delay?: number 
}) => {
  const [count, setCount] = React.useState(0);
  
  React.useEffect(() => {
    if (!end) return;
    
    let startTime: number;
    let animationFrame: number;
    
    // Animation function
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;
      
      const progress = Math.min(elapsedTime / (duration * 1000), 1);
      const currentCount = Math.floor(progress * end);
      
      setCount(currentCount);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    // Start animation after delay
    const timeoutId = setTimeout(() => {
      animationFrame = requestAnimationFrame(animate);
    }, delay * 1000);
    
    return () => {
      clearTimeout(timeoutId);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, delay]);
  
  return <>{count}</>;
};
