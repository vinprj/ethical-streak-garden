
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface NotificationSettingsProps {
  enableNotifications: boolean;
  setEnableNotifications: (checked: boolean) => void;
  notificationTime: string;
  setNotificationTime: (value: string) => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  enableNotifications,
  setEnableNotifications,
  notificationTime,
  setNotificationTime
}) => {
  return (
    <div className="space-y-4 bg-card rounded-lg border p-4 transition-all hover:border-primary/30">
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
  );
};
