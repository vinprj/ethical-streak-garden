
import React from "react";
import { Button } from "@/components/ui/button";
import { BarChart2, LineChart } from "lucide-react";

interface ChartControlsProps {
  chartType: 'bar' | 'line';
  setChartType: (type: 'bar' | 'line') => void;
}

export const ChartControls: React.FC<ChartControlsProps> = ({ 
  chartType, 
  setChartType 
}) => {
  return (
    <div className="flex space-x-2">
      <Button
        variant={chartType === 'bar' ? 'default' : 'outline'}
        size="sm" 
        onClick={() => setChartType('bar')}
        className="flex items-center gap-1"
        style={chartType === 'bar' ? {backgroundColor: '#29AB87'} : {}}
      >
        <BarChart2 className="h-4 w-4" />
        <span className="text-xs">Bar</span>
      </Button>
      <Button 
        variant={chartType === 'line' ? 'default' : 'outline'} 
        size="sm"
        onClick={() => setChartType('line')}
        className="flex items-center gap-1"
        style={chartType === 'line' ? {backgroundColor: '#29AB87'} : {}}
      >
        <LineChart className="h-4 w-4" />
        <span className="text-xs">Line</span>
      </Button>
    </div>
  );
};
