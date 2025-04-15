
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useGardenContext } from "@/context/GardenContext";
import { toast } from "sonner";
import { RefreshCcw, Leaf } from "lucide-react";

export const GardenSettings: React.FC = () => {
  const { 
    isGardenEnabled, 
    setIsGardenEnabled,
    gardenAnimationsLevel,
    setGardenAnimationsLevel,
    ecoMode,
    setEcoMode,
    highContrastGarden,
    setHighContrastGarden
  } = useGardenContext();
  
  const handleToggleGarden = (checked: boolean) => {
    setIsGardenEnabled(checked);
    toast(checked ? "Garden Enabled" : "Garden Disabled", {
      description: checked 
        ? "Your habit garden is now active" 
        : "Your garden will be hidden but your plants will still grow",
    });
  };
  
  const handleEcoModeToggle = (checked: boolean) => {
    setEcoMode(checked);
    if (checked) {
      // If eco mode is on, also reduce animations
      setGardenAnimationsLevel('minimal');
      toast("Eco-Mode Enabled", {
        description: "Reduced animations to save energy",
      });
    } else {
      toast("Eco-Mode Disabled", {
        description: "Standard garden experience restored",
      });
    }
  };
  
  const handleResetGarden = () => {
    if (confirm("This will reset all your plants to their initial state. Are you sure?")) {
      // Clear garden plants from localStorage
      localStorage.removeItem('garden-plants');
      toast("Garden Reset", {
        description: "Your garden has been reset to its initial state",
      });
      // Reload page to apply changes
      window.location.reload();
    }
  };

  return (
    <div className="space-y-4 bg-card rounded-lg border p-4 transition-all hover:border-primary/30">
      {/* Enable/disable garden feature */}
      <div className="flex items-center justify-between space-x-2">
        <div>
          <Label htmlFor="enable-garden">Enable Habit Garden</Label>
          <p className="text-sm text-muted-foreground">
            Visualize your habits as growing plants
          </p>
        </div>
        <Switch 
          id="enable-garden" 
          checked={isGardenEnabled}
          onCheckedChange={handleToggleGarden}
        />
      </div>
      
      {/* Animation level settings */}
      <div className="space-y-2 pt-2">
        <Label>Animation Level</Label>
        <RadioGroup 
          value={gardenAnimationsLevel} 
          onValueChange={(value) => setGardenAnimationsLevel(value as 'none' | 'minimal' | 'standard')}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="standard" id="animations-standard" disabled={ecoMode} />
            <Label htmlFor="animations-standard" className={ecoMode ? "text-muted-foreground" : ""}>
              Standard (full animations)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="minimal" id="animations-minimal" />
            <Label htmlFor="animations-minimal">
              Minimal (reduced animations)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="animations-none" />
            <Label htmlFor="animations-none">
              None (static garden)
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      {/* Eco-conscious mode */}
      <div className="flex items-center justify-between pt-4 space-x-2">
        <div>
          <Label htmlFor="eco-mode">Eco-Conscious Mode</Label>
          <p className="text-sm text-muted-foreground">
            Optimize for energy efficiency
          </p>
        </div>
        <Switch 
          id="eco-mode" 
          checked={ecoMode}
          onCheckedChange={handleEcoModeToggle}
        />
      </div>
      
      {/* High contrast option */}
      <div className="flex items-center justify-between pt-2 space-x-2">
        <div>
          <Label htmlFor="high-contrast">High Contrast Garden</Label>
          <p className="text-sm text-muted-foreground">
            Increase visibility of garden elements
          </p>
        </div>
        <Switch 
          id="high-contrast" 
          checked={highContrastGarden}
          onCheckedChange={setHighContrastGarden}
        />
      </div>
      
      {/* Reset garden button */}
      <div className="pt-4">
        <Button variant="outline" onClick={handleResetGarden} className="w-full">
          <RefreshCcw className="h-4 w-4 mr-2" />
          Reset Garden
        </Button>
      </div>
      
      <div className="pt-2 text-xs text-muted-foreground">
        <p className="flex items-center gap-1">
          <Leaf className="h-3 w-3" />
          Energy conscious settings help reduce the environmental impact of animations
        </p>
      </div>
    </div>
  );
};
