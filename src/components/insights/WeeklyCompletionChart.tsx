
import React, { useState } from "react";
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
import { BarChart2, LineChart as LineChartIcon } from "lucide-react";
import { useThemeContext } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

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
  
  const emptyColor = theme === 'dark' ? 'var(--muted)' : '#e5e7eb';
  const primaryColor = 'var(--primary)';
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2">
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
                fill={primaryColor}
                radius={[4, 4, 0, 0]} 
                isAnimationActive={isAnimated}
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isEmpty ? emptyColor : primaryColor} 
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
                stroke={primaryColor}
                strokeWidth={2}
                dot={{ fill: primaryColor, r: 4 }}
                isAnimationActive={isAnimated}
                animationDuration={1500}
                animationEasing="ease-out"
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
