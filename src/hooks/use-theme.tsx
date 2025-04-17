
import { createContext, useState, useEffect, useContext } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme as Theme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
    
    // Reapply custom theme colors if present
    const customTheme = localStorage.getItem('customTheme');
    if (customTheme) {
      // Find and apply the custom theme
      const themeData = {
        ocean: {
          primary: "#0EA5E9",
          background: theme === 'dark' ? '#0c1929' : '#f0f9ff',
          card: theme === 'dark' ? '#0f172a' : '#ffffff',
          accent: "#7dd3fc",
        },
        forest: {
          primary: "#10b981",
          background: theme === 'dark' ? '#0c1f17' : '#f0fdf4',
          card: theme === 'dark' ? '#0f291a' : '#ffffff',
          accent: "#86efac",
        },
        sunset: {
          primary: "#f97316",
          background: theme === 'dark' ? '#291807' : '#fff7ed',
          card: theme === 'dark' ? '#27150e' : '#ffffff',
          accent: "#fdba74",
        }
      }[customTheme];
      
      if (themeData) {
        root.style.setProperty('--primary', themeData.primary);
        root.style.setProperty('--background', themeData.background);
        root.style.setProperty('--card', themeData.card);
        root.style.setProperty('--accent', themeData.accent);
      }
    }
    
    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
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
