
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Settings, Bell, Lock, InfoIcon, Bug, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Import the refactored components
import { AccessibilitySettings } from "@/components/settings/AccessibilitySettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { AboutSection } from "@/components/settings/AboutSection";
import { SectionHeader } from "@/components/settings/SectionHeader";
import { BuddySettings } from "@/components/buddy/BuddySettings";

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  // UI Settings
  const [fontSize, setFontSize] = React.useState(1); // 1 is default
  const [reduceMotion, setReduceMotion] = React.useState(false);
  const [highContrast, setHighContrast] = React.useState(false);
  const [ecoMode, setEcoMode] = React.useState(false);
  const [enableAnimations, setEnableAnimations] = React.useState(true);
  
  // Notification Settings  
  const [enableNotifications, setEnableNotifications] = React.useState(true);
  const [notificationTime, setNotificationTime] = React.useState("morning");
  
  // Privacy Settings
  const [shareAnalytics, setShareAnalytics] = React.useState(false);
  const [storeDataLocally, setStoreDataLocally] = React.useState(true);

  // Apply any saved settings on component mount
  React.useEffect(() => {
    if (reduceMotion) {
      document.body.classList.add('reduce-animations');
    }
    
    if (ecoMode) {
      document.body.classList.add('eco-mode');
    }
    
    // Check for system preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduceMotion(true);
      setEnableAnimations(false);
      document.body.classList.add('reduce-animations');
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('reduce-animations');
      document.body.classList.remove('eco-mode');
    };
  }, [reduceMotion, ecoMode]);

  return (
    <AppLayout>
      <div className="flex flex-col gap-8 animate-fade-in">
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Settings className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-muted-foreground">Customize your experience</p>
            </div>
          </div>
        </section>
        
        {/* NEW: Habit Buddy Section */}
        <section className="animate-fade-in" style={{ animationDelay: "50ms" }}>
          <SectionHeader 
            icon={Sparkles} 
            title="Habit Buddy" 
          />
          <BuddySettings />
        </section>
        
        {/* Accessibility Settings */}
        <section className="animate-fade-in" style={{ animationDelay: "100ms" }}>
          <SectionHeader 
            icon={Settings} 
            title="Accessibility" 
          />
          <AccessibilitySettings 
            fontSize={fontSize}
            setFontSize={setFontSize}
            reduceMotion={reduceMotion}
            setReduceMotion={setReduceMotion}
            highContrast={highContrast}
            setHighContrast={setHighContrast}
            ecoMode={ecoMode}
            setEcoMode={setEcoMode}
            enableAnimations={enableAnimations}
            setEnableAnimations={setEnableAnimations}
          />
        </section>
        
        {/* Notification Settings */}
        <section className="animate-fade-in" style={{ animationDelay: "200ms" }}>
          <SectionHeader 
            icon={Bell}
            title="Notifications" 
          />
          <NotificationSettings 
            enableNotifications={enableNotifications}
            setEnableNotifications={setEnableNotifications}
            notificationTime={notificationTime}
            setNotificationTime={setNotificationTime}
          />
        </section>
        
        {/* Privacy & Data Settings */}
        <section className="animate-fade-in" style={{ animationDelay: "300ms" }}>
          <SectionHeader 
            icon={Lock}
            title="Privacy & Data" 
          />
          <PrivacySettings 
            shareAnalytics={shareAnalytics}
            setShareAnalytics={setShareAnalytics}
            storeDataLocally={storeDataLocally}
            setStoreDataLocally={setStoreDataLocally}
          />
        </section>
        
        {/* About Section */}
        <section className="animate-fade-in" style={{ animationDelay: "400ms" }}>
          <SectionHeader 
            icon={InfoIcon}
            title="About" 
          />
          <AboutSection />
        </section>

        {/* Debug Section (moved from landing page) */}
        <section className="animate-fade-in mb-8" style={{ animationDelay: "500ms" }}>
          <SectionHeader 
            icon={Bug}
            title="Debug" 
          />
          <div className="bg-card rounded-lg border p-4 transition-all hover:border-primary/30">
            <p className="text-sm text-muted-foreground mb-4">
              Generate demo data to explore all app features.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1.5"
              onClick={() => navigate('/debug')}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Load Demo Data
            </Button>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
