
import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Award, Gift, Shield, Check } from "lucide-react";
import { useHabits } from "@/context/HabitContext";
import { BadgeGrid } from "@/components/dashboard/BadgeGrid";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTheme } from "@/hooks/use-theme";
import { useToast } from "@/hooks/use-toast";

// Define the available themes
interface ThemeOption {
  name: string;
  key: string;
  pointsRequired: number;
  gradient: string;
  colors: {
    primary: string;
    background: string;
    card: string;
    accent: string;
  };
}

const themeOptions: ThemeOption[] = [
  {
    name: "Ocean Theme",
    key: "ocean",
    pointsRequired: 500,
    gradient: "bg-gradient-to-r from-blue-400 to-cyan-300",
    colors: {
      primary: "#0EA5E9",
      background: "#f0f9ff",
      card: "#ffffff",
      accent: "#7dd3fc",
    },
  },
  {
    name: "Forest Theme",
    key: "forest",
    pointsRequired: 1000,
    gradient: "bg-gradient-to-r from-emerald-400 to-lime-300",
    colors: {
      primary: "#10b981",
      background: "#f0fdf4",
      card: "#ffffff",
      accent: "#86efac",
    },
  },
  {
    name: "Sunset Theme",
    key: "sunset",
    pointsRequired: 2000,
    gradient: "bg-gradient-to-r from-orange-400 to-pink-300",
    colors: {
      primary: "#f97316",
      background: "#fff7ed",
      card: "#ffffff",
      accent: "#fdba74",
    },
  },
];

const RewardsPage: React.FC = () => {
  const { stats } = useHabits();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [activeTheme, setActiveTheme] = useState<string | null>(() => {
    // Get active custom theme from local storage if exists
    return localStorage.getItem('customTheme');
  });

  // Calculate level and progress
  const calculateLevel = (points: number) => {
    // Simple formula: each level requires level*100 points
    let level = 1;
    let remainingPoints = points;
    
    while (remainingPoints >= level * 100) {
      remainingPoints -= level * 100;
      level++;
    }
    
    // Calculate progress to next level
    const pointsForNextLevel = level * 100;
    const progress = Math.round((remainingPoints / pointsForNextLevel) * 100);
    
    return { level, progress, remainingPoints, pointsForNextLevel };
  };
  
  const { level, progress, remainingPoints, pointsForNextLevel } = calculateLevel(stats.points);

  // Apply a theme
  const applyTheme = (themeOption: ThemeOption) => {
    if (stats.points < themeOption.pointsRequired) {
      return;
    }

    // Save the active theme in local storage
    localStorage.setItem('customTheme', themeOption.key);
    setActiveTheme(themeOption.key);
    
    // Apply the theme colors to CSS variables
    const root = document.documentElement;
    
    // Apply theme-specific colors
    root.style.setProperty('--primary', themeOption.colors.primary);
    root.style.setProperty('--background', themeOption.colors.background);
    root.style.setProperty('--card', themeOption.colors.card);
    root.style.setProperty('--accent', themeOption.colors.accent);
    
    // Set the base theme mode (light or dark)
    setTheme(theme === 'dark' ? 'dark' : 'light');
    
    // Dispatch custom event for charts to update
    window.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
    
    toast({
      title: "Theme Applied",
      description: `${themeOption.name} has been applied successfully!`,
      variant: "default",
    });
  };

  const resetTheme = () => {
    // Clear custom theme
    localStorage.removeItem('customTheme');
    setActiveTheme(null);
    
    // Reset CSS variables
    const root = document.documentElement;
    root.style.removeProperty('--primary');
    root.style.removeProperty('--background');
    root.style.removeProperty('--card');
    root.style.removeProperty('--accent');
    
    // Reapply the base theme
    setTheme(theme);
    
    // Dispatch custom event for charts to update
    window.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
    
    toast({
      title: "Theme Reset",
      description: "Default theme has been restored",
      variant: "default",
    });
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Award className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Your Rewards</h1>
              <p className="text-muted-foreground">Celebrate your achievements</p>
            </div>
          </div>
        </section>
        
        {/* Level and points section */}
        <section className="bg-card rounded-lg border p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-4xl font-bold text-primary">{level}</span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl font-bold mb-1">Level {level}</h2>
              <p className="text-muted-foreground mb-4">Consistency Champion</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Progress to Level {level + 1}</span>
                  <span>{remainingPoints} / {pointsForNextLevel}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              
              <div className="flex items-center gap-4 justify-center md:justify-start">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{stats.points}</p>
                  <p className="text-xs text-muted-foreground">Total Points</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-500">{stats.longestStreak}</p>
                  <p className="text-xs text-muted-foreground">Longest Streak</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-500">{stats.totalCompletions}</p>
                  <p className="text-xs text-muted-foreground">Completions</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Badges section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Badges
            </h2>
          </div>
          <BadgeGrid />
        </section>
        
        {/* Rewards section - theme customizations */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Theme Customizations
            </h2>
            
            {activeTheme && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={resetTheme}
              >
                Reset to Default
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themeOptions.map((themeOption) => (
              <Card key={themeOption.key} className={activeTheme === themeOption.key ? "ring-2 ring-primary" : ""}>
                <CardHeader className="text-center py-4">
                  <div className="flex items-center justify-center gap-2">
                    <h3 className="font-medium">{themeOption.name}</h3>
                    {activeTheme === themeOption.key && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 text-center">
                  <div className={`h-24 rounded-md ${themeOption.gradient} mb-4`}></div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {stats.points >= themeOption.pointsRequired 
                      ? "Available to use" 
                      : `Unlocks at ${themeOption.pointsRequired} points (${themeOption.pointsRequired - stats.points} more needed)`}
                  </p>
                  <Button 
                    variant={activeTheme === themeOption.key ? "default" : "outline"} 
                    disabled={stats.points < themeOption.pointsRequired}
                    onClick={() => applyTheme(themeOption)}
                    className="w-full"
                  >
                    {activeTheme === themeOption.key ? "Applied" : "Apply Theme"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default RewardsPage;
