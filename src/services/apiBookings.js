import { getToday } from "../utils/helpers";
import { PAGE_SIZE } from "../utils/constants";
import supabase from "./supabase";

// Funcția pentru obținerea rezervărilor cu opțiuni de filtrare, sortare și paginare
export async function getBookings({ filter, sortBy, page }) {
  let query = supabase
    .from("bookings") // Selectăm tabelul "bookings"
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice, cabins(name), guests(fullName,email)", // Alegem coloanele necesare
      { count: "exact" } // Contorizăm exact numărul de înregistrări
    );

  // FILTRARE
  if (filter) query = query[filter.method || "eq"](filter.field, filter.value);

  // SORTARE
  if (sortBy)
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === "asc",
    });

  // PAGINARE
  if (page) {
    const from = (page - 1) * PAGE_SIZE; // Calculăm indexul de început
    const to = from + PAGE_SIZE - 1; // Calculăm indexul final

    query = query.range(from, to); // Adăugăm intervalul de paginare la query
  }

  const { data, error, count } = await query;
  if (error) {
    console.error(error);
    throw new Error("Bookings could not be loaded");
  }
  return { data, count };
}

// Funcția pentru obținerea detaliilor unei rezervări după ID
export async function getBooking(id) {
  const { data, error } = await supabase
    .from("bookings") // Selectăm tabelul "bookings"
    .select("*, cabins(*), guests(*)") // Alegem toate coloanele din "bookings" + datele complete ale cabanelor și oaspeților
    .eq("id", id) // Căutăm rezervarea cu ID-ul specificat
    .single(); // Asigurăm că primim doar un rezultat (rezervarea cu acest ID)

  if (error) {
    console.error(error);
    throw new Error("Booking not found");
  }

  return data;
}

// Funcția pentru obținerea rezervărilor efectuate după o anumită dată
export async function getBookingsAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings") // Selectăm din tabelul "bookings"
    .select("created_at, totalPrice, extrasPrice") // Alegem doar câteva coloane necesare
    .gte("created_at", date) // Filtrăm rezervările create după sau la acea dată
    .lte("created_at", getToday({ end: true })); // Filtrăm rezervările create până la sfârșitul zilei de azi

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Funcția pentru obținerea oaspeților care sunt sau au fost cazați după o anumită dată
export async function getStaysAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings") // Selectăm datele din tabelul "bookings"
    .select("*, guests(fullName)") // Alegem toate coloanele din "bookings" și fullName din "guests"
    .gte("startDate", date) // Filtrăm rezervările cu startDate >= data dată
    .lte("startDate", getToday()); // Filtrăm rezervările cu startDate <= ziua curentă

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Funcția pentru obținerea activității (check-in / check-out) de azi
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from("bookings") // Selectăm datele din tabelul "bookings"
    .select("*, guests(fullName, nationality, countryFlag)") // Alegem coloanele necesare pentru activitate
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    ) // Verificăm dacă statusul este "unconfirmed" și startDate este azi sau dacă statusul este "checked-in" și endDate este azi
    // Echivalent cu
    // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate)))
    // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))
    .order("created_at"); // Sortăm rezervările după data creării

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Funcția pentru actualizarea unei rezervări după ID
export async function updateBooking(id, obj) {
  const { data, error } = await supabase
    .from("bookings") // Selectăm tabelul "bookings"
    .update(obj) // Actualizăm cu obiectul primit
    .eq("id", id) // Căutăm rezervarea cu ID-ul specificat
    .select() // Selectăm datele actualizate
    .single(); // Asigurăm că primim doar un rezultat

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }

  return data;
}

// Funcția pentru ștergerea unei rezervări după ID
export async function deleteBooking(id) {
  // POLITICI RLS: Asigurați-vă că aveți politici RLS pentru securitate
  const { data, error } = await supabase.from("bookings").delete().eq("id", id); // Ștergem rezervarea cu ID-ul specificat

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }

  return data;
}
