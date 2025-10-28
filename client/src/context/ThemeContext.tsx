import React, { createContext, useEffect, useState } from "react";

type ThemeContextType = {
  theme: "dark" | "light";
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

type ThemeContextProviderProps = {
  children: React.ReactNode;
};

const ThemeContextProvider = ({ children }: ThemeContextProviderProps) => {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? JSON.parse(savedTheme) : "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme));

    if (theme === "dark") {
      document.documentElement.style.setProperty(
        "--color-bg",
        "hsl(220, 10%, 5%)"
      );
      document.documentElement.style.setProperty(
        "--color-text",
        "hsl(0, 0%, 100%)"
      );
    } else {
      document.documentElement.style.setProperty(
        "--color-bg",
        "hsl(210, 20%, 96%)"
      );
      document.documentElement.style.setProperty(
        "--color-text",
        "hsl(220, 15%, 10%)"
      );
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeContextProvider };
