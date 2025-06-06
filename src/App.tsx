
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { useEffect } from "react";

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
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";

// Providers
import { HabitProvider } from "./context/HabitContext";
import { BuddyProvider } from "./context/BuddyContext";
import { GardenProvider } from "./context/GardenContext";
import { AuthProvider } from "./context/AuthContext";
import { AppThemeProvider } from "./components/ui/theme-provider";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

function App() {
  // Apply saved accessibility settings on app initialization
  useEffect(() => {
    // Apply font size
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
      const fontSize = parseFloat(savedFontSize);
      document.documentElement.style.fontSize = `${fontSize * 100}%`;
      document.documentElement.style.setProperty('--app-font-scale', fontSize.toString());
    }

    // Apply eco mode
    const ecoMode = localStorage.getItem('ecoMode') === 'true';
    const body = document.body;
    const html = document.documentElement;
    
    if (ecoMode) {
      body.classList.add('reduce-animations', 'eco-mode');
      html.classList.add('reduce-animations', 'eco-mode');
      
      // Apply to all elements
      document.querySelectorAll('*').forEach(el => {
        (el as HTMLElement).style.animationDuration = '0.001s';
        (el as HTMLElement).style.transitionDuration = '0.001s';
      });
    }
  }, []);

  return (
    <AppThemeProvider>
      <AuthProvider>
        <HabitProvider>
          <BuddyProvider>
            <GardenProvider>
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/welcome" element={<Index />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={<Navigate to="/" replace />} />
                <Route path="/today" element={
                  <ProtectedRoute>
                    <TodayPage />
                  </ProtectedRoute>
                } />
                <Route path="/insights" element={
                  <ProtectedRoute>
                    <InsightsPage />
                  </ProtectedRoute>
                } />
                <Route path="/rewards" element={
                  <ProtectedRoute>
                    <RewardsPage />
                  </ProtectedRoute>
                } />
                <Route path="/archive" element={
                  <ProtectedRoute>
                    <ArchivePage />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } />
                <Route path="/help" element={
                  <ProtectedRoute>
                    <HelpPage />
                  </ProtectedRoute>
                } />
                <Route path="/garden" element={
                  <ProtectedRoute>
                    <GardenPage />
                  </ProtectedRoute>
                } />
                <Route path="/buddies" element={
                  <ProtectedRoute>
                    <BuddiesPage />
                  </ProtectedRoute>
                } />
                <Route path="/debug" element={
                  <ProtectedRoute>
                    <DebugPage />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster richColors position="top-center" />
            </GardenProvider>
          </BuddyProvider>
        </HabitProvider>
      </AuthProvider>
    </AppThemeProvider>
  );
}

export default App;
