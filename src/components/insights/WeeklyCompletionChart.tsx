
import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell 
} from "recharts";

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
  return (
    <div className="h-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" />
          <YAxis 
            tickFormatter={(value) => `${value}%`}
            domain={[0, 100]} 
          />
          <Tooltip 
            formatter={(value, name, props) => {
              if (props.payload.isEmpty) {
                return ["No habits scheduled", ""];
              }
              return [`${value}% (${props.payload.completed}/${props.payload.total})`, "Completion"];
            }}
            labelFormatter={(label) => `${label}`}
          />
          <Bar 
            dataKey="percentage" 
            fill="var(--primary)" 
            radius={[4, 4, 0, 0]} 
            isAnimationActive={isAnimated}
            animationDuration={1200}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.isEmpty ? "var(--muted)" : "var(--primary)"} 
                opacity={entry.isEmpty ? 0.3 : 1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
