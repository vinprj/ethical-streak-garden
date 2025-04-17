
import React, { useState, useEffect } from "react";
import { 
  BarChart, 
  Bar, 
  LineChart,
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
import { BarChart2, LineChart as LineChartIcon, Settings } from "lucide-react";
import { useThemeContext } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

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
            <LineChartIcon className="h-4 w-4" />
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
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--foreground)" />
              <YAxis 
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]} 
                stroke="var(--foreground)"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                  borderRadius: "6px"
                }}
                formatter={(value, name, props) => {
                  if (props.payload.isEmpty) {
                    return ["No habits scheduled", ""];
                  }
                  return [`${value}% (${props.payload.completed}/${props.payload.total})`, "Completion"];
                }}
                labelFormatter={(label) => `${label}`}
              />
              <Legend />
              <Bar 
                dataKey="percentage" 
                name="Completion Rate"
                fill={barColor}
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
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--foreground)" />
              <YAxis 
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]} 
                stroke="var(--foreground)"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                  borderRadius: "6px"
                }}
                formatter={(value, name, props) => {
                  if (props.payload.isEmpty) {
                    return ["No habits scheduled", ""];
                  }
                  return [`${value}% (${props.payload.completed}/${props.payload.total})`, "Completion"];
                }}
                labelFormatter={(label) => `${label}`}
              />
              <Legend />
              <Line 
                type="monotone"
                dataKey="percentage" 
                name="Completion Rate"
                stroke={barColor}
                strokeWidth={2}
                dot={{ fill: barColor, r: 4 }}
                isAnimationActive={isAnimated}
                animationDuration={1500}
                animationEasing="ease-out"
                connectNulls={true}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
