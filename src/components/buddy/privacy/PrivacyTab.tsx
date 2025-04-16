
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { useBuddy } from "@/context/BuddyContext";
import { PrivacyLevel } from "@/types/buddy";

export const PrivacyTab: React.FC = () => {
  const { privacyLevel, setPrivacyLevel } = useBuddy();
  
  return (
    <div className="space-y-4 rounded-md border p-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Privacy Level</h3>
        <RadioGroup
          value={privacyLevel}
          onValueChange={(val) => setPrivacyLevel(val as PrivacyLevel)}
          className="space-y-2 pt-1"
        >
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="minimal" id="minimal-privacy" />
            <div className="grid gap-0.5">
              <Label htmlFor="minimal-privacy" className="cursor-pointer">Minimal Sharing</Label>
              <p className="text-xs text-muted-foreground">Only share streak counts, no habit details</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="moderate" id="moderate-privacy" />
            <div className="grid gap-0.5">
              <Label htmlFor="moderate-privacy" className="cursor-pointer">Moderate Sharing</Label>
              <p className="text-xs text-muted-foreground">Share streak counts and habit names for selected habits</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="open" id="open-privacy" />
            <div className="grid gap-0.5">
              <Label htmlFor="open-privacy" className="cursor-pointer">Open Sharing</Label>
              <p className="text-xs text-muted-foreground">Share full details for selected habits</p>
            </div>
          </div>
        </RadioGroup>
      </div>
      
      <div className="pt-3 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="receive-encouragement">Receive Encouragement</Label>
            <p className="text-xs text-muted-foreground">Allow buddies to send encouragements</p>
          </div>
          <Switch id="receive-encouragement" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="buddy-notifications">Buddy Notifications</Label>
            <p className="text-xs text-muted-foreground">Get notified about buddy activity</p>
          </div>
          <Switch id="buddy-notifications" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="anonymous-connections">Anonymous Mode</Label>
            <p className="text-xs text-muted-foreground">Hide your identity from new connections</p>
          </div>
          <Switch id="anonymous-connections" />
        </div>
      </div>
      
      <div className="pt-3">
        <p className="text-xs text-muted-foreground bg-muted p-2 rounded flex items-start">
          <Shield className="h-3.5 w-3.5 mr-1.5 mt-0.5 flex-shrink-0" />
          Your privacy is important! You control what you share and can disconnect from buddies at any time.
        </p>
      </div>
    </div>
  );
};
