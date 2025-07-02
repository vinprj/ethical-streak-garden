
import React from "react";
import { GanttChartSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavItem } from "./NavItem";
import { NavItemType } from "./types";

interface DesktopSidebarProps {
  navItems: NavItemType[];
  bottomNavItems: NavItemType[];
  isOfflineMode: boolean;
  onLogoClick: () => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  navItems,
  bottomNavItems,
  isOfflineMode,
  onLogoClick
}) => {
  return (
    <div className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-background sm:flex sm:flex-col">
      <div className="flex h-14 items-center border-b px-4" onClick={onLogoClick}>
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

      <ScrollArea className="flex-1 py-4">
        <div className="flex flex-col gap-1 px-2">
          {navItems.map((item) => (
            <NavItem 
              key={item.path + item.name}
              name={item.name}
              path={item.path}
              icon={item.icon}
              badgeCount={item.badgeCount}
            />
          ))}
        </div>
      </ScrollArea>
      
      <div className="border-t py-4">
        <div className="flex flex-col gap-1 px-2">
          {bottomNavItems.map((item) => (
            <NavItem
              key={item.path + item.name}
              name={item.name}
              path={item.path}
              icon={item.icon}
              badgeCount={item.badgeCount}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
