import { formatDistance, parseISO, differenceInDays, format } from "date-fns"; // Importăm funcții din biblioteca date-fns pentru manipularea și formatarea datelor

// Functia subtractDates calculează diferența în zile între două date
// Parametrii dateStr1 și dateStr2 pot fi fie obiecte Date, fie stringuri ISO (de exemplu, cele returnate de Supabase)
export const subtractDates = (dateStr1, dateStr2) =>
  differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2))); // Convertim datele în obiecte Date folosind parseISO și calculăm diferența în zile între ele

// Functia formatDistanceFromNow formatează diferența de timp între o dată dată și momentul curent
// Parametru dateStr este un string ISO care reprezintă data
export const formatDistanceFromNow = (dateStr) =>
  formatDistance(parseISO(dateStr), new Date(), {
    // Calculăm diferența de timp folosind formatDistance
    addSuffix: true, // Adăugăm sufixul corespunzător (ex: "in 2 days" sau "3 days ago")
  })
    .replace("about ", "") // Eliminăm "about" pentru un text mai curat
    .replace("in", "In"); // Corectăm capitalizarea "In"

// Functia getToday returnează data curentă în format ISO, cu opțiunea de a seta ora la începutul sau sfârșitul zilei
// Parametru options este un obiect care poate conține cheia `end`, care indică dacă vrem să obținem sfârșitul zilei
export const getToday = function (options = {}) {
  const today = new Date(); // Obținem data curentă

  // Dacă opțiunea `end` este adevărată, setăm ora la 23:59:59.999 pentru a obține sfârșitul zilei
  if (options?.end)
    today.setUTCHours(23, 59, 59, 999); // Setăm ora la ultima secundă a zilei
  else today.setUTCHours(0, 0, 0, 0); // Setăm ora la începutul zilei
  return today.toISOString(); // Returnăm data în format ISO
};

// Functia formatCurrency formatează un număr ca monedă, în formatul USD
export const formatCurrency = (value) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "USD" }).format(
    value // Formatează valoarea ca monedă în USD
  );
