# SPA Hotel Management Demo

**Puteți încerca o versiune complet funcțională a acestui feature :** https://spa-hotel-management-app.vercel.app

**Sursa video pentru prezentarea toolkit-ului :**

## Descriere

Acest proiect este un demo al unei aplicații single page pentru managementul hotelier, realizat pentru a explora și învăța gestionarea stării remote cu React Query, caching pe client și navigare cu React Router v6.
Este o aplicație modernă de management hotelier, dezvoltată pentru a demonstra abilitățile de dezvoltare cu tehnologii moderne. Proiectul include fluxuri complete de autentificare, gestionare a datelor demo (rezervări, cabine, oaspeți), afișarea de statistici și grafice, precum și implementarea unei interfețe UI reutilizabile și responsive.

## Cuprins

- [Funcționalități](#funcționalități)
- [Tehnologii folosite](#tehnologii-folosite)
- [Arhitectura Aplicației](#arhitectura-aplicației)

## Funcționalități

- **Modul Dark/Light:**

  - Gestionat printr-un context personalizat (`DarkModeContext`) și hook-ul `useLocalStorageState`, care sincronizează state-ul cu LocalStorage.
  - Comutarea între modurile dark și light aplică clase CSS pe document, modificând stilurile aplicației.

- **Autentificare și Gestionarea Utilizatorilor:**

  - Formulare de login, logout, înregistrare (signup) și actualizare cont (date și parolă) dezvoltate cu React Hook Form.
  - Hook-uri personalizate (`useLogin`, `useLogout`, `useSignUp`, `useUpdateUser`, `useUser`) pentru gestionarea fluxurilor de autentificare și actualizarea datelor.
  - Funcțiile API de autentificare sunt implementate cu Supabase, inclusiv operațiuni de upload pentru avatar.

- **Gestionarea Datelor Demo:**

  - Funcționalități de încărcare, ștergere și creare a datelor demo pentru rezervări, cabine și oaspeți, implementate cu Supabase.
  - Calculul automată al unor informații (număr de nopți, prețuri totale, status rezervări) folosind utilitare precum date-fns și funcții de formatare.

- **Prezentarea Datelor:**

  - Rezervările și cabinele sunt afișate în tabele, utilizând componente dedicate precum `BookingDataBox`, `BookingRow`, `BookingTable`, `CabinRow` și `CabinTable`.
  - Funcționalități de filtrare, sortare și paginare (ex.: `BookingTableOperations`, `CabinTableOperations`) pentru manipularea datelor.

- **Dashboard și Statistici:**

  - Dashboard-ul prezintă statistici relevante (număr de rezervări, vânzări totale, check-in-uri, rata de ocupare) prin componente precum `Stats`.
  - Graficele (SalesChart, DurationChart) sunt realizate cu Recharts și se adaptează în funcție de date și temă.
  - Activitatea din ziua curentă este afișată prin componenta `TodayActivity`.

- **Fluxuri de Check-in/Check-out:**

  - Implementate prin hook-uri personalizate (`useCheckin`, `useCheckout`) și componente dedicate (`CheckinBooking`, `CheckoutButton`), care actualizează statusul rezervărilor în timp real.

- **Navigație și Routing:**

  - Aplicația este o Single Page Application (SPA) gestionată cu React Router v6, oferind navigare fluidă între pagini (Dashboard, Bookings, Cabins, Checkin, Login, Signup, Account, etc.).
  - Hook-ul `useMoveBack` permite revenirea rapidă la pagina anterioară.

- **Componente UI Reutilizabile:**
  - Toate componentele UI (butoane, formulare, input-uri, tabele, modaluri, tag-uri etc.) sunt dezvoltate cu Styled Components pentru a asigura un design consistent și dezvoltare rapidă.
  - Componente suplimentare precum `TableOperations`, `Filter`, `SortBy`, `Empty` și `Spinner` completează interfața.

## Tehnologii folosite

- **Framework & Biblioteci Frontend:**
  - **React** – pentru crearea interfeței de utilizator.
  - **React Router v6** – pentru navigarea în cadrul aplicației.
  - **React Query** – pentru preluarea, caching-ul și actualizarea datelor din API-uri.
  - **React Hook Form** – pentru gestionarea formularelor și validare.
  - **Styled Components** – pentru stilizarea componentelor.
  - **Recharts** – pentru afișarea graficelor.
  - **date-fns** – pentru manipularea și formatarea datelor.
  - **React Icons** & **Lucide React** – pentru iconografie.
- **Backend & Servicii:**

  - **Supabase** – pentru autentificare, gestionarea sesiunilor și manipularea datelor demo (rezervări, cabine, oaspeți).

- **Instrumente de Dezvoltare:**
  - **ESLint** & **Prettier** – pentru asigurarea calității și formatarea consistentă a codului.

## Arhitectura Aplicației

Aplicația este construită ca o Single Page Application (SPA) și este organizată modular, astfel încât fiecare funcționalitate este dezvoltată în module clare:

### Frontend

- **React & React Router v6:**

  - Navigarea este gestionată prin React Router v6, permițând schimbul rapid între pagini (Dashboard, Bookings, Cabins, Checkin, etc.).

- **Gestionarea Stării și a Datelor Asincrone:**

  - **React Query** gestionează starea globală ( remote state ) și datele asincrone.
  - Hook-urile personalizate (`useUser`, `useLogin`, `useLogout`, etc.) asigură sincronizarea cu API-urile backend.

- **Formulare și Validare:**
  - **React Hook Form** gestionează formularele de autentificare, înregistrare și actualizare de date.
- **Componente UI Reutilizabile:**
  - Componentele UI sunt dezvoltate cu Styled Components pentru a asigura un design consistent și reutilizabil (ex.: tabele, modaluri, butoane, input-uri).
- **Gestionarea Tematicii (Dark/Light Mode):**
  - Un context dedicat (`DarkModeContext`) împreună cu hook-ul `useLocalStorageState` gestionează tema aplicației.

### Backend (Demo)

- **Supabase:**

  - Supabase se ocupă de autentificare, gestionarea sesiunilor și manipularea datelor demo pentru rezervări, cabine și oaspeți.
  - Funcțiile API pentru operații CRUD sunt implementate pentru a demonstra gestionarea datelor într-un backend real.

- **Fluxuri de Check-in/Check-out:**
  - Hook-urile `useCheckin` și `useCheckout` gestionează actualizarea statusului rezervărilor și fluxurile de check-in/check-out în timp real.
