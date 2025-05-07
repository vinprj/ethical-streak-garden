
import React from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { MobileNavItem } from "./MobileNavItem";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NavItemType } from "./types";

interface MobileMenuProps {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  mainNavItems: NavItemType[];
  secondaryNavItems: NavItemType[];
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ 
  expanded, 
  setExpanded,
  mainNavItems,
  secondaryNavItems
}) => {
  return (
    <div className="fixed bottom-0 left-0 z-30 w-full border-t bg-background py-2">
      <div className="flex justify-around">
        {mainNavItems.slice(0, 5).map((item) => (
          <MobileNavItem
            key={item.path + item.name}
            name={item.name}
            path={item.path}
            icon={item.icon}
            badgeCount={item.badgeCount}
          />
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
            {[...mainNavItems.slice(5), ...secondaryNavItems].map((item) => (
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
                  {item.badgeCount !== undefined && (
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
};
