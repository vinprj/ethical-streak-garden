
import { createContext, useState, useEffect, useContext } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  applyCustomTheme: (themeKey: string | null) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  applyCustomTheme: () => {},
});

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
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme as Theme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [customThemeKey, setCustomThemeKey] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('customTheme') : null
  );

  // Apply theme colors based on the current theme and custom theme
  const applyThemeColors = (themeMode: Theme, customKey: string | null) => {
    const root = document.documentElement;
    
    // Reset custom properties first
    root.style.removeProperty('--primary');
    root.style.removeProperty('--background');
    root.style.removeProperty('--card');
    root.style.removeProperty('--accent');
    
    if (customKey && customThemes[customKey]) {
      const themeColors = customThemes[customKey].colors[themeMode];
      
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
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
    
    // Apply theme colors whenever theme changes
    applyThemeColors(theme, customThemeKey);
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme, customTheme: customThemeKey } }));
  }, [theme, customThemeKey]);

  // Apply saved custom theme on initial load
  useEffect(() => {
    if (customThemeKey) {
      applyThemeColors(theme, customThemeKey);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, applyCustomTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  
  return context;
}

export function useTheme() {
  return useThemeContext();
}
