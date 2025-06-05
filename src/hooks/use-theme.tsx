
import { createContext, useState, useEffect, useContext } from 'react';

type Theme = 'light' | 'dark' | 'high-contrast';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;
  applyCustomTheme: (themeKey: string | null) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeColors {
  primary: string;
  background: string; 
  card: string;
  accent: string;
}

interface CustomTheme {
  key: string;
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
}

// Define available themes
const customThemes: Record<string, CustomTheme> = {
  ocean: {
    key: "ocean",
    colors: {
      light: {
        primary: "#0EA5E9",
        background: "#f0f9ff",
        card: "#ffffff",
        accent: "#7dd3fc",
      },
      dark: {
        primary: "#0EA5E9",
        background: "#0c1929",
        card: "#0f172a",
        accent: "#7dd3fc",
      },
    },
  },
  forest: {
    key: "forest",
    colors: {
      light: {
        primary: "#10b981",
        background: "#f0fdf4",
        card: "#ffffff",
        accent: "#86efac",
      },
      dark: {
        primary: "#10b981",
        background: "#0c1f17",
        card: "#0f291a",
        accent: "#86efac", 
      },
    },
  },
  sunset: {
    key: "sunset",
    colors: {
      light: {
        primary: "#f97316",
        background: "#fff7ed",
        card: "#ffffff",
        accent: "#fdba74",
      },
      dark: {
        primary: "#f97316",
        background: "#291807",
        card: "#27150e",
        accent: "#fdba74",
      },
    },
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [customThemeKey, setCustomThemeKey] = useState<string | null>(null);

  // Initialize theme from localStorage after mount
  useEffect(() => {
    setMounted(true);
    
    const savedTheme = localStorage.getItem('theme');
    const savedCustomTheme = localStorage.getItem('customTheme');
    
    if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'high-contrast') {
      setTheme(savedTheme as Theme);
    } else {
      // Default to system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
    
    if (savedCustomTheme) {
      setCustomThemeKey(savedCustomTheme);
    }
  }, []);

  // Cycle through themes: light → dark → high-contrast → light
  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('high-contrast');
    } else {
      setTheme('light');
    }
  };

  // Apply theme colors based on the current theme and custom theme
  const applyThemeColors = (themeMode: Theme, customKey: string | null) => {
    const root = document.documentElement;
    
    // Reset custom properties first
    root.style.removeProperty('--primary');
    root.style.removeProperty('--background');
    root.style.removeProperty('--card');
    root.style.removeProperty('--accent');
    
    if (customKey && customThemes[customKey] && themeMode !== 'high-contrast') {
      const baseTheme = themeMode === 'dark' ? 'dark' : 'light';
      const themeColors = customThemes[customKey].colors[baseTheme];
      
      // Apply custom theme colors
      root.style.setProperty('--primary', themeColors.primary);
      root.style.setProperty('--background', themeColors.background);
      root.style.setProperty('--card', themeColors.card);
      root.style.setProperty('--accent', themeColors.accent);
    }
  };

  // Function to apply a custom theme
  const applyCustomTheme = (themeKey: string | null) => {
    if (themeKey === null) {
      // Clear custom theme
      localStorage.removeItem('customTheme');
      setCustomThemeKey(null);
    } else if (customThemes[themeKey]) {
      // Set the custom theme
      localStorage.setItem('customTheme', themeKey);
      setCustomThemeKey(themeKey);
    }
    
    // Apply theme colors
    applyThemeColors(theme, themeKey);
    
    // Dispatch custom event for charts to update
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme, customTheme: themeKey } }));
  };

  // Handle theme changes
  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'high-contrast');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
    
    // Apply theme colors whenever theme changes (skip for high-contrast as it uses CSS)
    if (theme !== 'high-contrast') {
      applyThemeColors(theme, customThemeKey);
    }
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme, customTheme: customThemeKey } }));
  }, [theme, customThemeKey, mounted]);

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme, applyCustomTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}

// Export as AppThemeProvider for use in App.tsx
export { ThemeProvider as AppThemeProvider };
