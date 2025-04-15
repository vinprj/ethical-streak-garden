
import React from "react";
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

  // Handle eco-mode toggle
  const handleEcoModeToggle = (checked: boolean) => {
    setEcoMode(checked);
    
    if (checked) {
      // Apply eco mode - reduce animations further and optimize rendering
      document.body.classList.add('eco-mode');
      // If eco mode is on, also reduce animations
      setEnableAnimations(false);
      document.body.classList.add('reduce-animations');
      toast("Eco-Mode enabled", {
        description: "Reduced animations and background processes to save energy"
      });
    } else {
      document.body.classList.remove('eco-mode');
      toast("Eco-Mode disabled", {
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
        />
      </div>
      
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="high-contrast">High Contrast Mode</Label>
        <Switch 
          id="high-contrast" 
          checked={highContrast}
          onCheckedChange={setHighContrast}
        />
      </div>
      
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="reduce-motion">Reduce Motion</Label>
        <Switch 
          id="reduce-motion" 
          checked={reduceMotion}
          onCheckedChange={setReduceMotion}
        />
      </div>
      
      <div className="flex items-center justify-between space-x-2">
        <div>
          <Label htmlFor="eco-mode">Eco-Conscious Mode</Label>
          <p className="text-sm text-muted-foreground">Reduces animations and background processes</p>
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
