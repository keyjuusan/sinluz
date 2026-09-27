import { useContext } from "react";
import { themeContext } from "../contexts/ThemeContext";

export function useTheme() {
  const context = useContext(themeContext);
  if (!context) {
    throw new Error("useTheme debe ser usado dentro de ThemeProvider");
  }
  return context;
}
