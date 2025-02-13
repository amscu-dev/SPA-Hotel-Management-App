import { createContext, useContext, useEffect } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

const DarkModeContext = createContext();

// Componenta de provider pentru DarkModeContext
function DarkModeProvider({ children }) {
  // Setăm starea dark mode folosind useLocalStorageState (valoare implicită pe baza preferinței sistemului)
  const [isDarkMode, setIsDarkMode] = useLocalStorageState(
    window.matchMedia("(prefers-color-scheme: dark)").matches, // Verificăm dacă utilizatorul are setat dark mode în sistem
    "isDarkMode" // Cheia din LocalStorage unde vom salva starea
  );

  useEffect(
    function () {
      if (isDarkMode) {
        document.documentElement.classList.add("dark-mode");
        document.documentElement.classList.remove("light-mode");
      } else {
        document.documentElement.classList.remove("dark-mode");
        document.documentElement.classList.add("light-mode");
      }
    },
    [isDarkMode] // Efectul se va rula doar atunci când valoarea isDarkMode se schimbă
  );

  // Funcție pentru a comuta între dark mode și light mode
  function toggleDarkMode() {
    setIsDarkMode((isDark) => !isDark);
  }

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

// Hook personalizat pentru a utiliza contextul DarkModeContext
function useDarkMode() {
  const context = useContext(DarkModeContext); // Obținem valoarea contextului
  if (context === undefined)
    throw new Error("DarkModeContext was used outside of DarkModeProvider"); // Dacă contextul nu este disponibil, aruncăm o eroare
  return context;
}

export { DarkModeProvider, useDarkMode };
