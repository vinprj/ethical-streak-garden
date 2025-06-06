
import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Minus, Plus } from "lucide-react";

interface AccessibilitySettingsProps {
  fontSize: number;
  setFontSize: (value: number) => void;
  ecoMode: boolean;
  setEcoMode: (checked: boolean) => void;
}

const FONT_SIZE_OPTIONS = [
  { value: 0.75, label: "Small (75%)" },
  { value: 1, label: "Medium (100%)" },
  { value: 1.25, label: "Large (125%)" },
  { value: 1.5, label: "Extra Large (150%)" },
];

export const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({
  fontSize,
  setFontSize,
  ecoMode,
  setEcoMode
}) => {
  // Apply font size globally when it changes
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize * 100}%`;
    
    // Also update CSS custom property for consistent scaling
    document.documentElement.style.setProperty('--app-font-scale', fontSize.toString());
    
    return () => {
      document.documentElement.style.fontSize = '';
      document.documentElement.style.removeProperty('--app-font-scale');
    };
  }, [fontSize]);

  // Apply eco mode and reduced motion globally
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;
    
    // Remove existing classes
    body.classList.remove('reduce-animations', 'eco-mode');
    html.classList.remove('reduce-animations', 'eco-mode');
    
    // Apply based on current settings
    if (ecoMode) {
      body.classList.add('reduce-animations', 'eco-mode');
      html.classList.add('reduce-animations', 'eco-mode');
      
      // Also apply to all existing elements for immediate effect
      document.querySelectorAll('*').forEach(el => {
        (el as HTMLElement).style.animationDuration = '0.001s';
        (el as HTMLElement).style.transitionDuration = '0.001s';
      });
    } else {
      // Reset animation durations when eco mode is disabled
      document.querySelectorAll('*').forEach(el => {
        (el as HTMLElement).style.animationDuration = '';
        (el as HTMLElement).style.transitionDuration = '';
      });
    }
    
    return () => {
      body.classList.remove('reduce-animations', 'eco-mode');
      html.classList.remove('reduce-animations', 'eco-mode');
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

  // Font size stepper functions
  const increaseFontSize = () => {
    const currentIndex = FONT_SIZE_OPTIONS.findIndex(option => option.value === fontSize);
    if (currentIndex < FONT_SIZE_OPTIONS.length - 1) {
      const newSize = FONT_SIZE_OPTIONS[currentIndex + 1].value;
      setFontSize(newSize);
      toast("Font size increased", {
        description: `Changed to ${FONT_SIZE_OPTIONS[currentIndex + 1].label}`
      });
    }
  };

  const decreaseFontSize = () => {
    const currentIndex = FONT_SIZE_OPTIONS.findIndex(option => option.value === fontSize);
    if (currentIndex > 0) {
      const newSize = FONT_SIZE_OPTIONS[currentIndex - 1].value;
      setFontSize(newSize);
      toast("Font size decreased", {
        description: `Changed to ${FONT_SIZE_OPTIONS[currentIndex - 1].label}`
      });
    }
  };

  const currentFontIndex = FONT_SIZE_OPTIONS.findIndex(option => option.value === fontSize);

  return (
    <div className="space-y-6 bg-card rounded-lg border p-4 transition-all hover:border-primary/30">
      {/* Font Size Controls */}
      <div className="space-y-4">
        <Label htmlFor="font-size-group">Font Size</Label>
        
        {/* Stepper Controls */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={decreaseFontSize}
            disabled={currentFontIndex <= 0}
            aria-label="Decrease font size"
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 text-center">
            <span className="text-lg font-medium">
              {FONT_SIZE_OPTIONS[currentFontIndex]?.label || "Custom"}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={increaseFontSize}
            disabled={currentFontIndex >= FONT_SIZE_OPTIONS.length - 1}
            aria-label="Increase font size"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Radio Group Alternative */}
        <RadioGroup 
          value={fontSize.toString()} 
          onValueChange={(value) => setFontSize(parseFloat(value))}
          className="grid grid-cols-2 gap-2"
          aria-label="Font size options"
        >
          {FONT_SIZE_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem 
                value={option.value.toString()} 
                id={`font-${option.value}`}
                className="sr-only"
              />
              <Label 
                htmlFor={`font-${option.value}`}
                className={`flex-1 cursor-pointer rounded-md border p-3 text-center transition-colors hover:bg-accent ${
                  fontSize === option.value ? 'border-primary bg-accent' : 'border-border'
                }`}
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        <p className="text-xs text-muted-foreground">
          This setting applies to the entire app and works with your device's accessibility settings.
        </p>
      </div>
      
      {/* Eco-Conscious & Reduced Motion */}
      <div className="flex items-center justify-between space-x-2">
        <div>
          <Label htmlFor="eco-mode">Eco-Conscious & Reduced Motion</Label>
          <p className="text-sm text-muted-foreground">
            Reduces animations throughout the app for accessibility and energy efficiency. 
            Compliant with WCAG 2.1 reduced motion requirements.
          </p>
        </div>
        <Switch 
          id="eco-mode" 
          checked={ecoMode}
          onCheckedChange={handleEcoModeToggle}
          aria-describedby="eco-mode-description"
        />
      </div>
      
      <div id="eco-mode-description" className="sr-only">
        When enabled, this setting reduces or eliminates animations and motion effects throughout the entire app, 
        making it more accessible for users with motion sensitivities and more energy efficient.
      </div>
    </div>
  );
};
