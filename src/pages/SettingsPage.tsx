
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Settings, Bell, Lock, Database, Eye, Monitor, InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

const SettingsPage: React.FC = () => {
  // UI Settings
  const [fontSize, setFontSize] = React.useState(1); // 1 is default
  const [reduceMotion, setReduceMotion] = React.useState(false);
  const [highContrast, setHighContrast] = React.useState(false);
  const [ecoMode, setEcoMode] = React.useState(false);
  
  // Notification Settings  
  const [enableNotifications, setEnableNotifications] = React.useState(true);
  const [notificationTime, setNotificationTime] = React.useState("morning");
  
  // Privacy Settings
  const [shareAnalytics, setShareAnalytics] = React.useState(false);
  const [storeDataLocally, setStoreDataLocally] = React.useState(true);

  const handleReset = () => {
    // In a real app, this would clear all user data
    localStorage.removeItem("ethical-habit-tracker-data");
    toast("Settings Reset", {
      description: "All data has been cleared",
    });
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };

  const handleExportData = () => {
    const data = localStorage.getItem("ethical-habit-tracker-data");
    
    if (data) {
      // Create a blob and download it
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "habitflow-data.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast("Data Exported", {
        description: "Your data has been exported as JSON",
      });
    } else {
      toast("No Data", {
        description: "There is no data to export",
      });
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Settings className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-muted-foreground">Customize your experience</p>
            </div>
          </div>
        </section>
        
        {/* Accessibility Settings */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Accessibility</h2>
          <div className="space-y-4 bg-card rounded-lg border p-4">
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
                onCheckedChange={setEcoMode}
              />
            </div>
          </div>
        </section>
        
        {/* Notification Settings */}
        <section>
          <h2 className="text-xl font-semibold mb-4">
            <Bell className="h-5 w-5 inline mr-2" />
            Notifications
          </h2>
          <div className="space-y-4 bg-card rounded-lg border p-4">
            <div className="flex items-center justify-between space-x-2">
              <div>
                <Label htmlFor="notifications">Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">Get reminded of your habits</p>
              </div>
              <Switch 
                id="notifications" 
                checked={enableNotifications}
                onCheckedChange={setEnableNotifications}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label>Notification Time</Label>
              <RadioGroup 
                defaultValue={notificationTime} 
                onValueChange={setNotificationTime}
                disabled={!enableNotifications}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="morning" id="morning" />
                  <Label htmlFor="morning">Morning (8:00 AM)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="afternoon" id="afternoon" />
                  <Label htmlFor="afternoon">Afternoon (1:00 PM)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="evening" id="evening" />
                  <Label htmlFor="evening">Evening (7:00 PM)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </section>
        
        {/* Privacy & Data Settings */}
        <section>
          <h2 className="text-xl font-semibold mb-4">
            <Lock className="h-5 w-5 inline mr-2" />
            Privacy &amp; Data
          </h2>
          <div className="space-y-4 bg-card rounded-lg border p-4">
            <div className="flex items-center justify-between space-x-2">
              <div>
                <Label htmlFor="analytics">Share Anonymous Analytics</Label>
                <p className="text-sm text-muted-foreground">Help us improve the app with anonymous usage data</p>
              </div>
              <Switch 
                id="analytics" 
                checked={shareAnalytics}
                onCheckedChange={setShareAnalytics}
              />
            </div>
            
            <div className="flex items-center justify-between space-x-2">
              <div>
                <Label htmlFor="local-storage">Store Data Locally</Label>
                <p className="text-sm text-muted-foreground">Keep all your data on your device only</p>
              </div>
              <Switch 
                id="local-storage" 
                checked={storeDataLocally}
                onCheckedChange={setStoreDataLocally}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button variant="outline" onClick={handleExportData}>
                <Database className="h-4 w-4 mr-2" />
                Export Your Data
              </Button>
              <Button variant="outline" className="text-destructive hover:text-destructive" onClick={handleReset}>
                Reset All Data
              </Button>
            </div>
          </div>
        </section>
        
        {/* About Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            <InfoIcon className="h-5 w-5 inline mr-2" />
            About
          </h2>
          <div className="space-y-4 bg-card rounded-lg border p-4">
            <div>
              <h3 className="font-medium">HabitFlow</h3>
              <p className="text-sm text-muted-foreground">Version 1.0.0</p>
              <p className="text-sm text-muted-foreground mt-2">
                An ethical habit tracking application designed to help you build consistent habits without manipulative design patterns.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">Our Ethical Commitment</h3>
              <p className="text-sm text-muted-foreground mt-1">
                We believe in building technology that respects your privacy, attention, and agency. HabitFlow is designed with ethical principles in mind, avoiding dark patterns and manipulative tactics.
              </p>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
