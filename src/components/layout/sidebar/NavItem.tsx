
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItemProps {
  name: string;
  path: string;
  icon: React.ReactNode;
  badgeCount?: number;
  onClick?: () => void;
}

export const NavItem: React.FC<NavItemProps> = ({ 
  name, 
  path, 
  icon, 
  badgeCount,
  onClick 
}) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors", {
          "bg-primary/10 text-primary hover:bg-primary/10": isActive,
          "text-muted-foreground hover:bg-muted hover:text-foreground": !isActive,
        })
      }
      onClick={onClick}
    >
      <div className="relative">
        {icon}
        {badgeCount !== undefined && (
          <span className="absolute -top-1 -right-2 bg-primary text-primary-foreground rounded-full w-3.5 h-3.5 flex items-center justify-center text-[10px]">
            {badgeCount}
          </span>
        )}
      </div>
      <span>{name}</span>
    </NavLink>
  );
};
