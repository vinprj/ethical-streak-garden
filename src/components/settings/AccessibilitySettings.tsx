
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
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
      document.body.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
      document.body.classList.remove('high-contrast');
    }
    return () => {
      document.documentElement.classList.remove('high-contrast');
      document.body.classList.remove('high-contrast');
    };
  }, [highContrast]);

  // Handle animation toggle
  const handleAnimationToggle = (checked: boolean) => {
    setEnableAnimations(checked);
    
    // Apply or remove reduced motion class to body
    if (!checked) {
      document.body.classList.add('reduce-animations');
      toast("Animations reduced", {
        description: "Most animations have been disabled for a calmer experience"
      });
    } else {
      document.body.classList.remove('reduce-animations');
      toast("Animations enabled", {
        description: "Subtle animations are now active"
      });
    }
  };

  // Combined eco-conscious mode (includes reduced motion)
  const handleEcoModeToggle = (checked: boolean) => {
    setEcoMode(checked);
    
    if (checked) {
      // Apply eco mode - reduce animations and optimize rendering
      document.body.classList.add('eco-mode');
      document.body.classList.add('reduce-animations');
      // Also set reduce motion when eco mode is enabled
      setReduceMotion(true);
      setEnableAnimations(false);
      toast("Eco-Conscious Mode enabled", {
        description: "Reduced animations and background processes to save energy and improve accessibility"
      });
    } else {
      document.body.classList.remove('eco-mode');
      // Only remove reduce-animations if the reduce motion setting isn't also on
      if (!reduceMotion) {
        document.body.classList.remove('reduce-animations');
      }
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
          <Label htmlFor="enable-animations">Enable Animations</Label>
          <p className="text-sm text-muted-foreground">Toggle subtle UI animations</p>
        </div>
        <Switch 
          id="enable-animations" 
          checked={enableAnimations}
          onCheckedChange={handleAnimationToggle}
          disabled={ecoMode}
        />
      </div>
      
      <div className="flex items-center justify-between space-x-2">
        <div>
          <Label htmlFor="high-contrast">High Contrast Mode</Label>
          <p className="text-sm text-muted-foreground">Enhance visual distinction throughout the app</p>
        </div>
        <Switch 
          id="high-contrast" 
          checked={highContrast}
          onCheckedChange={setHighContrast}
        />
      </div>
      
      <div className="flex items-center justify-between space-x-2">
        <div>
          <Label htmlFor="eco-mode">Eco-Conscious & Reduced Motion</Label>
          <p className="text-sm text-muted-foreground">Reduces animations, background processes, and motion for accessibility and energy efficiency</p>
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
