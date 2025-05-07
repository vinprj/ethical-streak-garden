
import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

// Pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import TodayPage from "./pages/TodayPage";
import RewardsPage from "./pages/RewardsPage";
import InsightsPage from "./pages/InsightsPage";
import ArchivePage from "./pages/ArchivePage";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/HelpPage";
import NotFound from "./pages/NotFound";
import DebugPage from "./pages/DebugPage";
import GardenPage from "./pages/GardenPage";
import BuddiesPage from "./pages/BuddiesPage";

// Providers
import { HabitProvider } from "./context/HabitContext";
import { BuddyProvider } from "./context/BuddyContext";
import { GardenProvider } from "./context/GardenContext";
import { AppThemeProvider } from "./components/ui/theme-provider";

function App() {
  return (
    <AppThemeProvider>
      <HabitProvider>
        <BuddyProvider>
          <GardenProvider>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Navigate to="/" replace />} />
              <Route path="/welcome" element={<Index />} />
              <Route path="/today" element={<TodayPage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/rewards" element={<RewardsPage />} />
              <Route path="/archive" element={<ArchivePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/garden" element={<GardenPage />} />
              <Route path="/buddies" element={<BuddiesPage />} />
              <Route path="/debug" element={<DebugPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster richColors position="top-center" />
          </GardenProvider>
        </BuddyProvider>
      </HabitProvider>
    </AppThemeProvider>
  );
}

export default App;
