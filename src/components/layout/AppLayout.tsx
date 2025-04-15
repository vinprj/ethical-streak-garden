
import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { UserStats } from "../dashboard/UserStats";
import { useHabits } from "@/context/HabitContext";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isOfflineMode } = useHabits();
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen max-h-screen overflow-hidden">
        <Header />
        {isOfflineMode && (
          <div className="bg-amber-500 text-white px-4 py-1 text-center text-sm font-medium">
            Offline Mode Active - Changes will sync when you're back online
          </div>
        )}
        <main className={cn("flex-1 overflow-auto p-4 md:p-6", isOfflineMode && "bg-secondary/30")}>
          <div className="container max-w-5xl mx-auto">
            <div className="mb-8">
              <UserStats />
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
