
import React from "react";

export interface NavItemType {
  name: string;
  path: string;
  icon: React.ReactNode;
  badgeCount?: number;
}
