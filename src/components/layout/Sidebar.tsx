
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { 
  Home, CalendarCheck2, BarChart2, Medal, 
  Archive, Settings, HelpCircle, Menu, X, Leaf
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHabits } from "@/context/HabitContext"; 
import { useGardenContext } from "@/context/GardenContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  extraLabel?: string;
  onClick?: () => void;
}

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { isOfflineMode } = useHabits();
  const { isGardenEnabled } = useGardenContext();
  
  const navItems = [
    { to: "/", icon: Home, label: "Dashboard" },
    { to: "/today", icon: CalendarCheck2, label: "Today" },
    { to: "/insights", icon: BarChart2, label: "Insights" },
    { to: "/rewards", icon: Medal, label: "Rewards" },
    { to: "/garden", icon: Leaf, label: "Garden" },
    { to: "/archive", icon: Archive, label: "Archive" },
    { to: "/settings", icon: Settings, label: "Settings" },
    { to: "/help", icon: HelpCircle, label: "Help" },
  ];

  const NavItem: React.FC<NavItemProps> = ({ 
    to, icon: Icon, label, extraLabel, onClick 
  }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:text-sidebar-foreground",
          "hover:bg-sidebar-accent group w-full",
          isActive 
            ? "bg-sidebar-accent text-sidebar-primary font-medium" 
            : "text-sidebar-foreground/80"
        )}
      >
        <Icon className={cn(
          "h-5 w-5",
          isActive ? "text-sidebar-primary" : "text-sidebar-foreground/80"
        )} />
        {label}
        {extraLabel && (
          <span className="ml-auto text-xs font-medium text-sidebar-primary bg-sidebar-primary/10 px-1.5 py-0.5 rounded">
            {extraLabel}
          </span>
        )}
      </Link>
    );
  };

  const SidebarContent = ({ onClick }: { onClick?: () => void }) => (
    <div className="space-y-4 py-4 h-full flex flex-col">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight text-sidebar-foreground">
          HabitFlow
        </h2>
        {isOfflineMode && (
          <div className="mb-2 px-2 py-1 text-xs font-medium bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded">
            Offline Mode
          </div>
        )}
      </div>
      <div className="px-3 py-1">
        <h2 className="mb-2 px-2 text-xs tracking-tight uppercase text-sidebar-foreground/70">
          Navigation
        </h2>
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavItem 
              key={item.label}
              to={item.to}
              icon={item.icon}
              label={item.label}
              onClick={onClick}
              // Special indicator for Garden feature when enabled
              extraLabel={item.to === "/garden" && isGardenEnabled ? "New" : undefined}
            />
          ))}
        </div>
      </div>
      <div className="mt-auto px-3 py-2">
        <div className="rounded-md bg-sidebar-primary/10 p-2">
          <h3 className="text-sm font-medium text-sidebar-foreground">
            Ethical Design
          </h3>
          <p className="text-xs text-sidebar-foreground/70 mt-1">
            HabitFlow is designed without dark patterns or manipulative features.
          </p>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 bg-sidebar p-0">
          <div className="absolute right-4 top-4">
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <X className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          </div>
          <SidebarContent onClick={() => document.body.click()} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="hidden md:block w-64 border-r border-sidebar-border bg-sidebar-background">
      <SidebarContent />
    </div>
  );
};
