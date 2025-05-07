
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle2,
  Home,
  BarChart2,
  Award,
  Archive,
  Settings,
  HelpCircle,
  Leaf,
  Menu,
  GanttChartSquare,
  Bug,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useHabits } from "@/context/HabitContext";
import { useBuddy } from "@/context/BuddyContext";

interface NavItemType {
  name: string;
  path: string;
  icon: React.ReactNode;
  badgeCount?: number;
}

export const Sidebar = () => {
  const isMobile = useIsMobile();
  const { isOfflineMode } = useHabits();
  const { buddies } = useBuddy();
  const [expanded, setExpanded] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  const toggleDebugMenu = () => {
    // Click the logo 5 times to show debug menu
    if (!showDebug) {
      const clickCount = parseInt(localStorage.getItem("debug_click_count") || "0") + 1;
      localStorage.setItem("debug_click_count", clickCount.toString());
      
      if (clickCount >= 5) {
        setShowDebug(true);
        localStorage.setItem("show_debug_menu", "true");
      }
    }
  };

  // Check if debug menu should be shown
  React.useEffect(() => {
    const shouldShow = localStorage.getItem("show_debug_menu") === "true";
    setShowDebug(shouldShow);
  }, []);

  const navItems: NavItemType[] = [
    { 
      name: "Dashboard", 
      path: "/",
      icon: <Home className="h-[18px] w-[18px]" />
    },
    { 
      name: "Today", 
      path: "/today",
      icon: <CheckCircle2 className="h-[18px] w-[18px]" /> 
    },
    { 
      name: "Insights", 
      path: "/insights",
      icon: <BarChart2 className="h-[18px] w-[18px]" /> 
    },
    {
      name: "Buddies",
      path: "/buddies",
      icon: <Users className="h-[18px] w-[18px]" />,
      badgeCount: buddies.length > 0 ? buddies.length : undefined
    },
    { 
      name: "Garden", 
      path: "/garden",
      icon: <Leaf className="h-[18px] w-[18px]" /> 
    },
    { 
      name: "Rewards", 
      path: "/rewards",
      icon: <Award className="h-[18px] w-[18px]" /> 
    },
    { 
      name: "Archive", 
      path: "/archive",
      icon: <Archive className="h-[18px] w-[18px]" /> 
    },
  ];

  const bottomNavItems: NavItemType[] = [
    { 
      name: "Settings", 
      path: "/settings",
      icon: <Settings className="h-[18px] w-[18px]" /> 
    },
    { 
      name: "Help", 
      path: "/help",
      icon: <HelpCircle className="h-[18px] w-[18px]" /> 
    },
  ];

  if (showDebug) {
    bottomNavItems.push({ 
      name: "Debug", 
      path: "/debug",
      icon: <Bug className="h-[18px] w-[18px]" /> 
    });
  }

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 z-30 w-full border-t bg-background py-2">
        <div className="flex justify-around">
          {navItems.slice(0, 5).map((item) => (
            <NavLink 
              key={item.path + item.name}
              to={item.path}
              className={({ isActive }) =>
                cn("flex flex-col items-center py-1 px-2 text-xs", {
                  "text-primary": isActive,
                  "text-muted-foreground": !isActive,
                })
              }
            >
              <div className="relative">
                {item.icon}
                {item.badgeCount && (
                  <span className="absolute -top-1 -right-2 bg-primary text-primary-foreground rounded-full w-3.5 h-3.5 flex items-center justify-center text-[10px]">
                    {item.badgeCount}
                  </span>
                )}
              </div>
              <span className="mt-1">{item.name}</span>
            </NavLink>
          ))}
          <Button 
            variant="ghost" 
            size="icon"
            className="flex flex-col items-center py-1 px-2"
            onClick={() => setExpanded(!expanded)}
          >
            <Menu className="h-[18px] w-[18px] text-muted-foreground" />
            <span className="mt-1 text-xs text-muted-foreground">Menu</span>
          </Button>
        </div>
        
        {expanded && (
          <div className="px-4 py-2 mt-2 border-t">
            <div className="grid grid-cols-3 gap-3">
              {[...navItems.slice(5), ...bottomNavItems].map((item) => (
                <NavLink 
                  key={item.path + item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    cn("flex flex-col items-center py-2 px-1 rounded-md", {
                      "bg-primary/10 text-primary": isActive,
                      "text-muted-foreground hover:bg-muted": !isActive,
                    })
                  }
                  onClick={() => setExpanded(false)}
                >
                  <div className="relative">
                    {item.icon}
                    {item.badgeCount && (
                      <span className="absolute -top-1 -right-2 bg-primary text-primary-foreground rounded-full w-3.5 h-3.5 flex items-center justify-center text-[10px]">
                        {item.badgeCount}
                      </span>
                    )}
                  </div>
                  <span className="mt-1 text-xs">{item.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-background sm:flex sm:flex-col">
      <div className="flex h-14 items-center border-b px-4" onClick={toggleDebugMenu}>
        <div className="flex items-center gap-2">
          <GanttChartSquare className="h-6 w-6 text-primary" />
          <span className="font-semibold">HabitFlow</span>
        </div>
        {isOfflineMode && (
          <div className="ml-2 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-600">
            Offline
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 py-4">
        <div className="flex flex-col gap-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path + item.name}
              to={item.path}
              className={({ isActive }) =>
                cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors", {
                  "bg-primary/10 text-primary hover:bg-primary/10": isActive,
                  "text-muted-foreground hover:bg-muted hover:text-foreground": !isActive,
                })
              }
            >
              <div className="relative">
                {item.icon}
                {item.badgeCount && (
                  <span className="absolute -top-1 -right-2 bg-primary text-primary-foreground rounded-full w-3.5 h-3.5 flex items-center justify-center text-[10px]">
                    {item.badgeCount}
                  </span>
                )}
              </div>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </ScrollArea>
      
      <div className="border-t py-4">
        <div className="flex flex-col gap-1 px-2">
          {showDebug ? (
            <>
              {bottomNavItems.map((item) => (
                <NavLink
                  key={item.path + item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors", {
                      "bg-primary/10 text-primary hover:bg-primary/10": isActive,
                      "text-muted-foreground hover:bg-muted hover:text-foreground": !isActive,
                    })
                  }
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </>
          ) : (
            <>
              {bottomNavItems.map((item) => (
                <NavLink
                  key={item.path + item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors", {
                      "bg-primary/10 text-primary hover:bg-primary/10": isActive,
                      "text-muted-foreground hover:bg-muted hover:text-foreground": !isActive,
                    })
                  }
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
