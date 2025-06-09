
import React from "react";
import { BuddiesTab } from "./buddies/BuddiesTab";

export const BuddiesOverview: React.FC = () => {
  const handleNavigateToConnect = () => {
    // This will be handled by the parent component (BuddiesPage)
    // by switching to the connect tab
    const event = new CustomEvent('navigate-to-connect');
    window.dispatchEvent(event);
  };

  return <BuddiesTab onNavigateToConnect={handleNavigateToConnect} />;
};
