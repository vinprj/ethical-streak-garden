
import React, { useEffect } from "react";
import { HorizontalNav } from "./HorizontalNav";
import { Header } from "./Header";
import { useHabits } from "@/context/HabitContext";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isOfflineMode } = useHabits();
  
  // Apply settings on page load/route change
  useEffect(() => {
    // Re-apply font size
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
      const fontSize = parseFloat(savedFontSize);
      document.documentElement.style.fontSize = `${fontSize * 100}%`;
      document.documentElement.style.setProperty('--app-font-scale', fontSize.toString());
    }

    // Re-apply eco mode
    const ecoMode = localStorage.getItem('ecoMode') === 'true';
    if (ecoMode) {
      document.body.classList.add('reduce-animations', 'eco-mode');
      document.documentElement.classList.add('reduce-animations', 'eco-mode');
    }
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <HorizontalNav />
      {isOfflineMode && (
        <div className="bg-amber-500 text-white px-4 py-1 text-center text-sm font-medium">
          Offline Mode Active - Changes will sync when you're back online
        </div>
      )}
      <main className={cn("flex-1 overflow-auto p-4 md:p-6", isOfflineMode && "bg-secondary/30")}>
        <div className="container max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
