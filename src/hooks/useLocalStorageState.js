import { useState, useEffect } from "react";

// Hook personalizat pentru a gestiona starea care este sincronizată cu localStorage
export function useLocalStorageState(initialState, key) {
  // Setăm starea inițială folosind hook-ul useState
  const [value, setValue] = useState(function () {
    // Căutăm în localStorage valoarea stocată cu cheia `key`
    const storedValue = localStorage.getItem(key);

    // Dacă valoarea există în localStorage, o parsem și o returnăm; altfel, folosim valoarea inițială
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  // Folosim useEffect pentru a sincroniza starea cu localStorage ori de câte ori valoarea sau cheia se schimbă
  useEffect(
    function () {
      // Salvăm valoarea actuală în localStorage
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key] // Efectul se va executa de fiecare dată când `value` sau `key` se schimbă
  );

  return [value, setValue];
}
