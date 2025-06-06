
import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Home,
  BarChart2,
  Award,
  Archive,
  Settings,
  HelpCircle,
  Leaf,
  Bug,
  Users,
  User
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useHabits } from "@/context/HabitContext";
import { useBuddy } from "@/context/BuddyContext";
import { NavItemType } from "./sidebar/types";
import { MobileMenu } from "./sidebar/MobileMenu";
import { DesktopSidebar } from "./sidebar/DesktopSidebar";

export const Sidebar = () => {
  const isMobile = useIsMobile();
  const { isOfflineMode } = useHabits();
  const { buddies } = useBuddy();
  const [expanded, setExpanded] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  // Toggle debug menu logic
  const toggleDebugMenu = () => {
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
  useEffect(() => {
    const shouldShow = localStorage.getItem("show_debug_menu") === "true";
    setShowDebug(shouldShow);
  }, []);

  // Define navigation items
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

  // Define bottom navigation items
  const bottomNavItems: NavItemType[] = [
    { 
      name: "Profile", 
      path: "/profile",
      icon: <User className="h-[18px] w-[18px]" /> 
    },
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

  // Add debug menu if enabled
  if (showDebug) {
    bottomNavItems.push({ 
      name: "Debug", 
      path: "/debug",
      icon: <Bug className="h-[18px] w-[18px]" /> 
    });
  }

  return isMobile ? (
    <MobileMenu
      expanded={expanded}
      setExpanded={setExpanded}
      mainNavItems={navItems}
      secondaryNavItems={bottomNavItems}
    />
  ) : (
    <DesktopSidebar
      navItems={navItems}
      bottomNavItems={bottomNavItems}
      isOfflineMode={isOfflineMode}
      onLogoClick={toggleDebugMenu}
    />
  );
};
