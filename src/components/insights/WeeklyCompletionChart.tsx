import React, { useState, useEffect } from "react";
import { 
  BarChart, 
  Bar, 
  LineChart as RechartsLineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell, 
  Legend
} from "recharts";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { ChartControls } from "./ChartControls";

interface WeekData {
  day: string;
  percentage: number;
  completed: number;
  total: number;
  isEmpty: boolean;
}

interface WeeklyCompletionChartProps {
  data: WeekData[];
  isAnimated: boolean;
}

export const WeeklyCompletionChart: React.FC<WeeklyCompletionChartProps> = ({ 
  data, 
  isAnimated 
}) => {
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const { theme } = useTheme();
  
  const emptyColor = theme === 'dark' ? 'var(--muted)' : '#e5e7eb';
  const chartColor = '#29AB87'; // Updated chart color to #29AB87
  
  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      // Force re-render when theme changes
      setChartType(prev => prev);
    };

    window.addEventListener('themechange', handleThemeChange);
    return () => {
      window.removeEventListener('themechange', handleThemeChange);
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <ChartControls chartType={chartType} setChartType={setChartType} />
      </div>
      
      <div className={cn(
        "h-[240px] transition-opacity duration-300",
        isAnimated ? "opacity-100" : "opacity-0"
      )}>
        <ChartContainer
          config={{
            completion: { 
              color: chartColor,
              label: "Completion Rate" 
            },
            empty: {
              color: emptyColor,
              label: "No Data"
            }
          }}
          className="h-full w-full"
        >
          {chartType === 'bar' ? (
            <BarChart data={data} className="h-full w-full">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--foreground)" />
              <YAxis 
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]} 
                stroke="var(--foreground)"
              />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-md">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">{label}</div>
                        <div className="font-medium text-right">
                          {data.isEmpty ? "No habits" : `${data.percentage}%`}
                        </div>
                        {!data.isEmpty && (
                          <>
                            <div className="text-xs text-muted-foreground">Completed</div>
                            <div className="text-xs text-right text-muted-foreground">
                              {data.completed}/{data.total}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                }}
              />
              <Legend />
              <Bar 
                dataKey="percentage"
                name="Completion Rate"
                fill={chartColor}
                radius={[4, 4, 0, 0]} 
                isAnimationActive={isAnimated}
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isEmpty ? emptyColor : chartColor} 
                    opacity={entry.isEmpty ? 0.3 : 1}
                  />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <RechartsLineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--foreground)" />
              <YAxis 
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]} 
                stroke="var(--foreground)"
              />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-md">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">{label}</div>
                        <div className="font-medium text-right">
                          {data.isEmpty ? "No habits" : `${data.percentage}%`}
                        </div>
                        {!data.isEmpty && (
                          <>
                            <div className="text-xs text-muted-foreground">Completed</div>
                            <div className="text-xs text-right text-muted-foreground">
                              {data.completed}/{data.total}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                }}
              />
              <Legend />
              <Line 
                type="monotone"
                dataKey="percentage"
                name="Completion Rate"
                stroke={chartColor}
                strokeWidth={2}
                dot={{ fill: chartColor, r: 4 }}
                isAnimationActive={isAnimated}
                animationDuration={1500}
                animationEasing="ease-out"
                connectNulls={true}
              />
            </RechartsLineChart>
          )}
        </ChartContainer>
      </div>
    </div>
  );
};
