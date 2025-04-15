
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  Award, 
  Settings, 
  Archive, 
  HelpCircle, 
  BarChart3, 
  Menu, 
  X 
} from "lucide-react";
import { useHabits } from "@/context/HabitContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  const { stats } = useHabits();
  
  const menuItems = [
    { name: "Dashboard", icon: <Home className="h-5 w-5" />, path: "/" },
    { name: "Today", icon: <Calendar className="h-5 w-5" />, path: "/today" },
    { name: "Insights", icon: <BarChart3 className="h-5 w-5" />, path: "/insights" },
    { name: "Rewards", icon: <Award className="h-5 w-5" />, path: "/rewards" },
    { name: "Archive", icon: <Archive className="h-5 w-5" />, path: "/archive" },
    { name: "Settings", icon: <Settings className="h-5 w-5" />, path: "/settings" },
    { name: "Help", icon: <HelpCircle className="h-5 w-5" />, path: "/help" },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar background overlay on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar content */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-72 border-r border-border bg-card md:sticky transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto py-5">
          <div className="px-6 mb-6">
            <h1 className="text-2xl font-bold text-primary">HabitFlow</h1>
            <p className="text-sm text-muted-foreground">Ethically designed for your growth</p>
          </div>
          
          <div className="px-4 mb-6">
            <div className="flex items-center justify-between bg-secondary rounded-lg p-3">
              <div>
                <p className="text-sm font-medium text-foreground">Your points</p>
                <p className="text-2xl font-bold text-primary">{stats.points}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                <Award className="h-5 w-5" />
              </div>
            </div>
          </div>

          <nav className="space-y-1 px-3 flex-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 hover:bg-secondary transition-colors",
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-foreground"
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto px-4">
            <div className="rounded-md bg-secondary/50 p-4">
              <div className="flex items-center">
                <span className="flex h-8 w-8 rounded-full bg-primary/20 items-center justify-center mr-3">
                  <span className="text-primary">🌱</span>
                </span>
                <div>
                  <p className="text-sm font-medium">Eco-Mode</p>
                  <p className="text-xs text-muted-foreground">Reduced animations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
