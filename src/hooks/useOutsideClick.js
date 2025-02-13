import { useEffect, useRef } from "react";

// Hook personalizat pentru a detecta click-urile în afara unui element
export function useOutsideClick(handler, listenCapturing = true) {
  const ref = useRef(); // Creăm o referință (ref) pentru a lega elementul la care dorim să detectăm click-urile

  useEffect(
    function () {
      // Funcția care va fi apelată la fiecare click
      function handleClick(e) {
        // Verificăm dacă click-ul nu a fost pe elementul referențiat de `ref`
        if (ref.current && !ref.current.contains(e.target)) {
          handler(); // Dacă click-ul nu a fost pe element, apelăm handler-ul
        }
      }
      // Adăugăm un eveniment de tip "click" pe document pentru a detecta click-urile
      // `listenCapturing` determină dacă ascultăm în faza de capturing (pentru modaluri sau dropdown-uri)
      document.addEventListener("click", handleClick, listenCapturing);

      // Returnăm o funcție de curățare care îndepărtează event listener-ul când componenta este demontată
      return () => document.removeEventListener("click", handleClick);
    },
    [handler, listenCapturing]
  );
  // Returnăm ref-ul pentru a fi atribuit elementului pe care vrem să-l monitorizăm
  return ref;
}
