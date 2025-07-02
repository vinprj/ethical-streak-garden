
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { useBuddy } from "@/context/BuddyContext";

export const HorizontalNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { buddies } = useBuddy();
  const [showDebug, setShowDebug] = React.useState(false);

  // Check if debug menu should be shown
  React.useEffect(() => {
    const shouldShow = localStorage.getItem("show_debug_menu") === "true";
    setShowDebug(shouldShow);
  }, []);

  const navItems = [
    { 
      name: "Dashboard", 
      path: "/",
      icon: <Home className="h-4 w-4" />
    },
    { 
      name: "Today", 
      path: "/today",
      icon: <CheckCircle2 className="h-4 w-4" /> 
    },
    { 
      name: "Insights", 
      path: "/insights",
      icon: <BarChart2 className="h-4 w-4" /> 
    },
    {
      name: "Buddies",
      path: "/buddies",
      icon: <Users className="h-4 w-4" />,
      badgeCount: buddies.length > 0 ? buddies.length : undefined
    },
    { 
      name: "Garden", 
      path: "/garden",
      icon: <Leaf className="h-4 w-4" /> 
    },
    { 
      name: "Rewards", 
      path: "/rewards",
      icon: <Award className="h-4 w-4" /> 
    },
    { 
      name: "Archive", 
      path: "/archive",
      icon: <Archive className="h-4 w-4" /> 
    },
    { 
      name: "Profile", 
      path: "/profile",
      icon: <User className="h-4 w-4" /> 
    },
    { 
      name: "Settings", 
      path: "/settings",
      icon: <Settings className="h-4 w-4" /> 
    },
    { 
      name: "Help", 
      path: "/help",
      icon: <HelpCircle className="h-4 w-4" /> 
    },
  ];

  // Add debug menu if enabled
  if (showDebug) {
    navItems.push({ 
      name: "Debug", 
      path: "/debug",
      icon: <Bug className="h-4 w-4" /> 
    });
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="sticky top-0 z-40 bg-background border-b border-border p-4">
      <div className="flex justify-center">
        <nav className="flex items-center space-x-1 bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-2 shadow-xl overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.path + item.name}
              onClick={() => handleNavClick(item.path)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-inter tracking-tighter transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap ${
                isActive(item.path)
                  ? "bg-white/30 backdrop-blur-md text-foreground shadow-lg"
                  : "text-muted-foreground hover:bg-white/10"
              }`}
            >
              {item.icon}
              <span className="hidden sm:inline">{item.name}</span>
              {item.badgeCount && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                  {item.badgeCount}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};
