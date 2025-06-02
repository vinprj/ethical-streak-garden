
import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

interface AccessibilitySettingsProps {
  fontSize: number;
  setFontSize: (value: number) => void;
  reduceMotion: boolean;
  setReduceMotion: (checked: boolean) => void;
  highContrast: boolean;
  setHighContrast: (checked: boolean) => void;
  ecoMode: boolean;
  setEcoMode: (checked: boolean) => void;
  enableAnimations: boolean;
  setEnableAnimations: (checked: boolean) => void;
}

export const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({
  fontSize,
  setFontSize,
  reduceMotion,
  setReduceMotion,
  highContrast,
  setHighContrast,
  ecoMode,
  setEcoMode,
  enableAnimations,
  setEnableAnimations
}) => {
  // Apply font size immediately when it changes
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize * 100}%`;
    return () => {
      document.documentElement.style.fontSize = '';
    };
  }, [fontSize]);

  // Apply high contrast mode globally
  useEffect(() => {
    const root = document.documentElement;
    
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    return () => {
      root.classList.remove('high-contrast');
    };
  }, [highContrast]);

  // Apply animation settings
  useEffect(() => {
    const body = document.body;
    
    // Remove all animation classes first
    body.classList.remove('reduce-animations', 'eco-mode');
    
    // Apply based on current settings
    if (ecoMode || reduceMotion || !enableAnimations) {
      body.classList.add('reduce-animations');
    }
    
    if (ecoMode) {
      body.classList.add('eco-mode');
    }
    
    return () => {
      body.classList.remove('reduce-animations', 'eco-mode');
    };
  }, [ecoMode, reduceMotion, enableAnimations]);

  // Combined eco-conscious mode (includes reduced motion)
  const handleEcoModeToggle = (checked: boolean) => {
    setEcoMode(checked);
    
    if (checked) {
      setReduceMotion(true);
      setEnableAnimations(false);
      toast("Eco-Conscious Mode enabled", {
        description: "Reduced animations and motion for accessibility and energy efficiency"
      });
    } else {
      toast("Eco-Conscious Mode disabled", {
        description: "Standard app experience restored"
      });
    }
  };

  // Handle high contrast toggle
  const handleHighContrastToggle = (checked: boolean) => {
    setHighContrast(checked);
    
    if (checked) {
      toast("High Contrast Mode enabled", {
        description: "Enhanced visual distinction throughout the app"
      });
    } else {
      toast("High Contrast Mode disabled", {
        description: "Standard contrast restored"
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
          <Label htmlFor="high-contrast">High Contrast Mode</Label>
          <p className="text-sm text-muted-foreground">Enhance visual distinction throughout the app</p>
        </div>
        <Switch 
          id="high-contrast" 
          checked={highContrast}
          onCheckedChange={handleHighContrastToggle}
        />
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
