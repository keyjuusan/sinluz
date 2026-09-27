import { createContext, useEffect, useState, type PropsWithChildren } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme,
  toggleTheme: ()=>void
}

export const themeContext = createContext<ThemeContextType | undefined>(undefined)

function getInitialTheme() {
  if (typeof window == undefined) return "dark";
  const temaGuardado = localStorage.getItem("theme");
  if (temaGuardado == "dark" || temaGuardado == "light") return temaGuardado;
  const oscuroPorDefecto = window.matchMedia("(prefers-color-scheme: dark)");
  const systemDefaultTheme = oscuroPorDefecto ? "dark" : "light";
  return systemDefaultTheme;
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme())
  function toggleTheme() {
    const newTheme = theme == "dark" ? "light" : "dark"
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme)
  }

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme == "dark");
  },[theme])

  return (
    <themeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </themeContext.Provider>
  )
}
