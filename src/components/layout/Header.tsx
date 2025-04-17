
import React from "react";
import { Bell, Moon, Sun, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHabits } from "@/context/HabitContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { HabitSearch } from "../habits/HabitSearch";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/use-theme";

export const Header: React.FC = () => {
  const { toggleOfflineMode, isOfflineMode } = useHabits();
  const { theme, setTheme } = useTheme();
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
  }, [location]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="border-b border-border bg-background p-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold hidden md:block">{pageTitle}</h2>
        </div>

        <div className="flex items-center gap-2">
          <HabitSearch />
          
          <Button variant="ghost" size="icon" onClick={toggleOfflineMode} title={isOfflineMode ? "Go Online" : "Go Offline"}>
            {isOfflineMode ? <WifiOff className="h-5 w-5" /> : <Wifi className="h-5 w-5" />}
          </Button>
          
          <Button variant="ghost" size="icon" onClick={toggleTheme} title={theme === 'dark' ? "Light Mode" : "Dark Mode"}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <div className="font-medium text-sm px-2 py-2">Notifications</div>
              <DropdownMenuSeparator />
              <div className="p-4 text-center text-sm text-muted-foreground">
                <p>No notifications</p>
                <p className="mt-1">Reminders will appear here when enabled</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-sm">
                Manage notification settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
