
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MobileNavItemProps {
  name: string;
  path: string;
  icon: React.ReactNode;
  badgeCount?: number;
}

export const MobileNavItem: React.FC<MobileNavItemProps> = ({ 
  name, 
  path, 
  icon,
  badgeCount
}) => {
  return (
    <NavLink 
      to={path}
      className={({ isActive }) =>
        cn("flex flex-col items-center py-1 px-2 text-xs", {
          "text-primary": isActive,
          "text-muted-foreground": !isActive,
        })
      }
    >
      <div className="relative">
        {icon}
        {badgeCount !== undefined && (
          <span className="absolute -top-1 -right-2 bg-primary text-primary-foreground rounded-full w-3.5 h-3.5 flex items-center justify-center text-[10px]">
            {badgeCount}
          </span>
        )}
      </div>
      <span className="mt-1">{name}</span>
    </NavLink>
  );
};
