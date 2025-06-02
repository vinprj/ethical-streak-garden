
import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

interface AccessibilitySettingsProps {
  fontSize: number;
  setFontSize: (value: number) => void;
  ecoMode: boolean;
  setEcoMode: (checked: boolean) => void;
}

export const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({
  fontSize,
  setFontSize,
  ecoMode,
  setEcoMode
}) => {
  // Apply font size immediately when it changes
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize * 100}%`;
    return () => {
      document.documentElement.style.fontSize = '';
    };
  }, [fontSize]);

  // Apply animation settings based on eco mode
  useEffect(() => {
    const body = document.body;
    
    // Remove animation classes first
    body.classList.remove('reduce-animations', 'eco-mode');
    
    // Apply based on current settings
    if (ecoMode) {
      body.classList.add('reduce-animations', 'eco-mode');
    }
    
    return () => {
      body.classList.remove('reduce-animations', 'eco-mode');
    };
  }, [ecoMode]);

  // Handle eco mode toggle
  const handleEcoModeToggle = (checked: boolean) => {
    setEcoMode(checked);
    
    if (checked) {
      toast("Eco-Conscious Mode enabled", {
        description: "Reduced animations and motion for accessibility and energy efficiency"
      });
    } else {
      toast("Eco-Conscious Mode disabled", {
        description: "Standard app experience restored"
      });
    }
  };

  return (
    <div className="space-y-4 bg-card rounded-lg border p-4 transition-all hover:border-primary/30">
      <div className="flex flex-col gap-2">
        <Label htmlFor="font-size">Font Size</Label>
        <div className="flex items-center gap-4">
          <span className="text-sm">A</span>
          <Slider 
            id="font-size" 
            min={0.75} 
            max={1.5} 
            step={0.25} 
            defaultValue={[fontSize]}
            onValueChange={(value) => setFontSize(value[0])}
            className="w-full max-w-sm"
          />
          <span className="text-lg">A</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Current size: {Math.round(fontSize * 100)}%
        </p>
      </div>
      
      <div className="flex items-center justify-between space-x-2">
        <div>
          <Label htmlFor="eco-mode">Eco-Conscious & Reduced Motion</Label>
          <p className="text-sm text-muted-foreground">Reduces animations and motion for accessibility and energy efficiency</p>
        </div>
        <Switch 
          id="eco-mode" 
          checked={ecoMode}
          onCheckedChange={handleEcoModeToggle}
        />
      </div>
    </div>
  );
};
