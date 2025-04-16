
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TodayPage from "./pages/TodayPage";
import InsightsPage from "./pages/InsightsPage";
import GardenPage from "./pages/GardenPage";
import RewardsPage from "./pages/RewardsPage";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/HelpPage";
import ArchivePage from "./pages/ArchivePage";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { HabitProvider } from "@/context/HabitContext";
import { GardenProvider } from "@/context/GardenContext";
import { BuddyProvider } from "@/context/BuddyContext";
import DebugPage from "./pages/DebugPage";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="habit-tracker-theme">
      <HabitProvider>
        <GardenProvider>
          <BuddyProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/today" element={<TodayPage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/garden" element={<GardenPage />} />
              <Route path="/rewards" element={<RewardsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/archive" element={<ArchivePage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/debug" element={<DebugPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </BuddyProvider>
        </GardenProvider>
      </HabitProvider>
    </ThemeProvider>
  );
}

export default App;
