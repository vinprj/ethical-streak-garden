
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";
import { toast } from "sonner";

interface PrivacySettingsProps {
  shareAnalytics: boolean;
  setShareAnalytics: (checked: boolean) => void;
  storeDataLocally: boolean;
  setStoreDataLocally: (checked: boolean) => void;
}

export const PrivacySettings: React.FC<PrivacySettingsProps> = ({
  shareAnalytics,
  setShareAnalytics,
  storeDataLocally,
  setStoreDataLocally
}) => {
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
    <div className="space-y-4 bg-card rounded-lg border p-4 transition-all hover:border-primary/30">
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
        <Button variant="outline" onClick={handleExportData} className="transition-all hover:bg-primary/5">
          <Database className="h-4 w-4 mr-2" />
          Export Your Data
        </Button>
        <Button variant="outline" className="text-destructive hover:text-destructive transition-all hover:bg-destructive/5" onClick={handleReset}>
          Reset All Data
        </Button>
      </div>
    </div>
  );
};
