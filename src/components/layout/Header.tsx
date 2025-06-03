
import React from "react";
import { Moon, Sun, Contrast } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HabitSearch } from "../habits/HabitSearch";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/use-theme";
import { NotificationCenter } from "../notifications/NotificationCenter";

export const Header: React.FC = () => {
  const { theme, cycleTheme } = useTheme();
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const location = useLocation();
  
  useEffect(() => {
    // Set page title based on route
    const path = location.pathname;
    if (path === "/") setPageTitle("Dashboard");
    else if (path === "/today") setPageTitle("Today's Habits");
    else if (path === "/insights") setPageTitle("Insights");
    else if (path === "/rewards") setPageTitle("Your Rewards");
    else if (path === "/archive") setPageTitle("Archive");
    else if (path === "/settings") setPageTitle("Settings");
    else if (path === "/help") setPageTitle("Help & Resources");
    else if (path === "/garden") setPageTitle("Habit Garden");
    else if (path === "/buddies") setPageTitle("Habit Buddies");
  }, [location]);

  // Get the appropriate icon for current theme
  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-5 w-5" />;
      case 'dark':
        return <Moon className="h-5 w-5" />;
      case 'high-contrast':
        return <Contrast className="h-5 w-5" />;
      default:
        return <Sun className="h-5 w-5" />;
    }
  };

  const getThemeTitle = () => {
    switch (theme) {
      case 'light':
        return "Switch to Dark Mode";
      case 'dark':
        return "Switch to High Contrast Mode";
      case 'high-contrast':
        return "Switch to Light Mode";
      default:
        return "Switch Theme";
    }
  };

  return (
    <header className="border-b border-border bg-background p-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold hidden md:block">{pageTitle}</h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Search positioned in the center-right area */}
          <div className="flex-shrink-0">
            <HabitSearch />
          </div>
          
          {/* Only show theme toggle if not on rewards page */}
          {location.pathname !== "/rewards" && (
            <Button variant="ghost" size="icon" onClick={cycleTheme} title={getThemeTitle()}>
              {getThemeIcon()}
            </Button>
          )}
          
          {/* Notification Center */}
          <NotificationCenter />
        </div>
      </div>
    </header>
  );
};
