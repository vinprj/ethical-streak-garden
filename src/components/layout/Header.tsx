
import React from "react";
import { Moon, Sun, Contrast, LogOut, GanttChartSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HabitSearch } from "../habits/HabitSearch";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/use-theme";
import { NotificationCenter } from "../notifications/NotificationCenter";
import { useAuth } from "@/context/AuthContext";
import { useHabits } from "@/context/HabitContext";

export const Header: React.FC = () => {
  const { theme, cycleTheme } = useTheme();
  const { signOut, user } = useAuth();
  const { isOfflineMode } = useHabits();
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const location = useLocation();
  
  // Toggle debug menu logic
  const toggleDebugMenu = () => {
    const showDebug = localStorage.getItem("show_debug_menu") === "true";
    if (!showDebug) {
      const clickCount = parseInt(localStorage.getItem("debug_click_count") || "0") + 1;
      localStorage.setItem("debug_click_count", clickCount.toString());
      
      if (clickCount >= 5) {
        localStorage.setItem("show_debug_menu", "true");
        window.location.reload(); // Reload to show debug menu in nav
      }
    }
  };
  
  useEffect(() => {
    // Set page title based on route
    const path = location.pathname;
    if (path === "/") setPageTitle("Dashboard");
    else if (path === "/today") setPageTitle("Today's Routines");
    else if (path === "/insights") setPageTitle("Insights");
    else if (path === "/rewards") setPageTitle("Your Rewards");
    else if (path === "/archive") setPageTitle("Archive");
    else if (path === "/settings") setPageTitle("Settings");
    else if (path === "/help") setPageTitle("Help & Resources");
    else if (path === "/garden") setPageTitle("Routine Garden");
    else if (path === "/buddies") setPageTitle("Routine Buddies");
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
        <div className="flex items-center gap-4" onClick={toggleDebugMenu}>
          <div className="flex items-center gap-2">
            <GanttChartSquare className="h-6 w-6 text-primary" />
            <span className="font-semibold">RoutineGarden</span>
          </div>
          {isOfflineMode && (
            <div className="ml-2 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-600">
              Offline
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Search positioned in the center-right area */}
          <div className="flex-shrink-0">
            <HabitSearch />
          </div>
          
          {/* Theme toggle */}
          <Button variant="ghost" size="icon" onClick={cycleTheme} title={getThemeTitle()}>
            {getThemeIcon()}
          </Button>
          
          {/* Notification Center */}
          <NotificationCenter />
          
          {/* Sign out button */}
          {user && (
            <Button variant="ghost" size="icon" onClick={signOut} title="Sign Out">
              <LogOut className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
