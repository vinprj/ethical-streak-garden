
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HabitProvider } from "@/context/HabitContext";

// Pages
import Dashboard from "./pages/Dashboard";
import TodayPage from "./pages/TodayPage";
import InsightsPage from "./pages/InsightsPage";
import RewardsPage from "./pages/RewardsPage";
import ArchivePage from "./pages/ArchivePage";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/HelpPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <HabitProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/today" element={<TodayPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </HabitProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
