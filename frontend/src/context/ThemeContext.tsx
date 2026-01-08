// frontend/src/context/ThemeContext.tsx

import React, { createContext, useState, useEffect, useContext } from "react";

type Theme = "light" | "dark";

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
  setThemeExplicit: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// Helper function to apply theme to DOM
const applyTheme = (theme: Theme) => {
  const root = document.documentElement;

  // Remove both classes first
  root.classList.remove("light", "dark");

  // Add the current theme class
  root.classList.add(theme);

  // Also set data attribute for any CSS that might use it
  root.setAttribute("data-theme", theme);

  // Force remove any system preference listening
  root.style.colorScheme = theme;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize theme from localStorage or default to 'light'
  const [theme, setTheme] = useState<Theme>(() => {
    // Try to get from localStorage first
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    if (storedTheme === "dark" || storedTheme === "light") {
      return storedTheme;
    }

    // Default to light (don't use system preference)
    return "light";
  });

  // Apply theme on mount and whenever it changes
  useEffect(() => {
    console.log("Applying theme:", theme);
    console.log(
      "HTML classes before:",
      document.documentElement.classList.toString()
    );
    applyTheme(theme);
    localStorage.setItem("theme", theme);
    console.log(
      "HTML classes after:",
      document.documentElement.classList.toString()
    );
  }, [theme]);

  const toggleTheme = () => {
    console.log("Toggle clicked, current theme:", theme);
    setTheme((currentTheme) => {
      const newTheme = currentTheme === "light" ? "dark" : "light";
      console.log("Switching to:", newTheme);
      return newTheme;
    });
  };

  const setThemeExplicit = (nextTheme: Theme) => {
    setTheme((currentTheme) => {
      if (currentTheme === nextTheme) {
        return currentTheme;
      }
      console.log("Forcing theme to:", nextTheme);
      return nextTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setThemeExplicit }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
