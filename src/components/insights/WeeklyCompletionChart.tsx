
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
import { Button } from "@/components/ui/button";
import { BarChart2, LineChart, Settings } from "lucide-react";
import { useThemeContext } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

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
  const { theme } = useThemeContext();
  const [barColor, setBarColor] = useState(() => {
    const savedColor = localStorage.getItem('chartBarColor');
    return savedColor || 'var(--primary)';
  });
  
  const emptyColor = theme === 'dark' ? 'var(--muted)' : '#e5e7eb';
  
  // Available colors for the chart
  const colorOptions = [
    { name: 'Primary', value: 'var(--primary)' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Pink', value: '#ec4899' },
  ];

  // Handle color change
  const handleColorChange = (color: string) => {
    setBarColor(color);
    localStorage.setItem('chartBarColor', color);
  };

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
  
  // Custom tooltip formatter
  const formatTooltip = (value: number, name: string, props: any) => {
    if (props.payload.isEmpty) {
      return ["No habits scheduled", ""];
    }
    return [`${value}% (${props.payload.completed}/${props.payload.total})`, "Completion"];
  };
  
  // Chart config
  const chartConfig = {
    line: {
      dataKey: "percentage",
      name: "Completion Rate",
      stroke: barColor,
      strokeWidth: 2,
    },
    bar: {
      dataKey: "percentage",
      name: "Completion Rate",
      fill: barColor,
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="flex space-x-2">
          <Button
            variant={chartType === 'bar' ? 'default' : 'outline'}
            size="sm" 
            onClick={() => setChartType('bar')}
            className="flex items-center gap-1"
          >
            <BarChart2 className="h-4 w-4" />
            <span className="text-xs">Bar</span>
          </Button>
          <Button 
            variant={chartType === 'line' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setChartType('line')}
            className="flex items-center gap-1"  
          >
            <LineChart className="h-4 w-4" />
            <span className="text-xs">Line</span>
          </Button>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <div 
                className="w-3 h-3 rounded-full mr-1"
                style={{ backgroundColor: barColor }}
              />
              <Settings className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {colorOptions.map((color) => (
              <DropdownMenuItem 
                key={color.value}
                onClick={() => handleColorChange(color.value)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color.value }}
                />
                <span>{color.name}</span>
                {barColor === color.value && <span className="ml-1">✓</span>}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className={cn(
        "h-[240px] transition-opacity duration-300",
        isAnimated ? "opacity-100" : "opacity-0"
      )}>
        <ChartContainer
          config={{
            completion: { 
              color: barColor,
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
                dataKey={chartConfig.bar.dataKey}
                name={chartConfig.bar.name}
                fill={chartConfig.bar.fill}
                radius={[4, 4, 0, 0]} 
                isAnimationActive={isAnimated}
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isEmpty ? emptyColor : barColor} 
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
                dataKey={chartConfig.line.dataKey}
                name={chartConfig.line.name}
                stroke={chartConfig.line.stroke}
                strokeWidth={chartConfig.line.strokeWidth}
                dot={{ fill: barColor, r: 4 }}
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
