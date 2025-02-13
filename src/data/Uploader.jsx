import styled from "styled-components";
import { useState } from "react";
import { isFuture, isPast, isToday } from "date-fns";
import supabase from "../services/supabase";
import { CiRoute } from "react-icons/ci";
import {
  SiReacthookform,
  SiReactquery,
  SiReactrouter,
  SiRedux,
  SiStyledcomponents,
  SiSupabase,
} from "react-icons/si";
import { FaDatabase, FaGithub, FaWpforms } from "react-icons/fa";
import { BsFiletypeCss } from "react-icons/bs";
import { subtractDates } from "../utils/helpers";
import { MdManageAccounts } from "react-icons/md";
import { bookings } from "./data-bookings";
import { cabins } from "./data-cabins";
import { guests } from "./data-guests";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import ButtonGroup from "../ui/ButtonGroup";

// Componenta TechModal afișează un tabel cu tehnologii folosite
function TechModal({ onCloseModal }) {
  return (
    <>
      <TechTabel>
        <TechRow>
          <span>
            <CiRoute />
          </span>
          <span>Routing</span>
          <span>
            <SiReactrouter />
          </span>
          <span>React Router</span>
        </TechRow>
        <TechRow>
          <span>
            <BsFiletypeCss />
          </span>
          <span>Styling</span>
          <span>
            <SiStyledcomponents />
          </span>
          <span>styled components</span>
        </TechRow>
        <TechRow>
          <span>
            <MdManageAccounts />
          </span>
          <span>Remote State Management</span>
          <span>
            <SiReactquery />
          </span>
          <span>React Query</span>
        </TechRow>
        <TechRow>
          <span>
            <MdManageAccounts />
          </span>
          <span>UI State Management</span>
          <span>
            <SiRedux />
          </span>
          <span>Context API</span>
        </TechRow>
        <TechRow>
          <span>
            <FaWpforms />
          </span>
          <span>Form Management</span>
          <span>
            <SiReacthookform />
          </span>
          <span>React Hook Form</span>
        </TechRow>
        <TechRow>
          <span>
            <FaDatabase />
          </span>
          <span>Data Management</span>
          <span>
            <SiSupabase />
          </span>
          <span>Supabase</span>
        </TechRow>
        <TechRow>
          <span>
            <FaDatabase />
          </span>
          <span>Other</span>
          <Others>React Icons / React hot toast / Recharts / date-fns</Others>
        </TechRow>
      </TechTabel>
      <ButtonGroup>
        <Button onClick={onCloseModal}>Cancel</Button>
        <Button
          onClick={() =>
            (window.location.href =
              "https://github.com/amscu-dev/SPA-Hotel-Management-App")
          }
          variation="secondary"
        >
          <FaGithub />
        </Button>
      </ButtonGroup>
    </>
  );
}
// Stilizarea componentelor
const HeaderUploader = styled.h3`
  color: #111827;
`;
const TechTabel = styled.div`
  background-color: var(--color-grey-50);
  color: var(--color-grey-700);
  padding: 1.2rem 2.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  border-radius: 1rem;
`;
const TechRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto 1fr;
  gap: 1rem;

  & span:first-child {
    display: flex;
    align-items: center;
    font-weight: 500;
    font-size: 2rem;
  }
  & span:nth-child(2) {
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    margin-right: 10rem;
  }
  & span:nth-child(3) {
    display: flex;
    align-items: center;
    font-weight: 500;
    font-size: 2.8rem;
    margin-bottom: 0.8rem;
  }
  & span:last-child {
    font-size: 1.8rem;
    display: flex;
    align-items: center;
  }
  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
    margin-bottom: 1rem;
  }
`;
const Others = styled.p`
  font-size: 1.4rem;
  grid-column: span 2;
  margin-left: -1.4rem;
`;

// Funcții pentru resetarea datelor
async function deleteGuests() {
  // Se face o interogare pentru a șterge toți oaspeții cu ID mai mare de 0
  const { error } = await supabase.from("guests").delete().gt("id", 0);
  if (error) console.log(error.message);
}

async function deleteCabins() {
  const { error } = await supabase.from("cabins").delete().gt("id", 0);
  if (error) console.log(error.message);
}

async function deleteBookings() {
  const { error } = await supabase.from("bookings").delete().gt("id", 0);
  if (error) console.log(error.message);
}

async function createGuests() {
  const { error } = await supabase.from("guests").insert(guests);
  if (error) console.log(error.message);
}

async function createCabins() {
  const { error } = await supabase.from("cabins").insert(cabins);
  if (error) console.log(error.message);
}

async function createBookings() {
  // Rezervările necesită un guestId și un cabinId. Nu putem cunoaște ID-urile pentru fiecare obiect din Supabase, deoarece acestea vor fi calculate automat de către Supabase. De asemenea, aceste ID-uri pot varia pentru diferiți utilizatori, mai ales după multiple încărcări de date. Prin urmare, este necesar să obținem mai întâi toate guestId-urile și cabinId-urile din baza de date, iar apoi să înlocuim ID-urile originale din datele de rezervare cu ID-urile reale obținute din DB.
  const { data: guestsIds } = await supabase
    .from("guests")
    .select("id")
    .order("id");
  const allGuestIds = guestsIds.map((cabin) => cabin.id);
  const { data: cabinsIds } = await supabase
    .from("cabins")
    .select("id")
    .order("id");
  const allCabinIds = cabinsIds.map((cabin) => cabin.id);

  const finalBookings = bookings.map((booking) => {
    // Aici ne bazăm pe ordinea cabanelor, deoarece acestea nu au ID-uri încă
    const cabin = cabins.at(booking.cabinId - 1);
    const numNights = subtractDates(booking.endDate, booking.startDate);
    const cabinPrice = numNights * (cabin.regularPrice - cabin.discount);
    const extrasPrice = booking.hasBreakfast
      ? numNights * 15 * booking.numGuests
      : 0; // hardcoded breakfast price
    const totalPrice = cabinPrice + extrasPrice;

    let status;
    if (
      isPast(new Date(booking.endDate)) &&
      !isToday(new Date(booking.endDate))
    )
      status = "checked-out";
    if (
      isFuture(new Date(booking.startDate)) ||
      isToday(new Date(booking.startDate))
    )
      status = "unconfirmed";
    if (
      (isFuture(new Date(booking.endDate)) ||
        isToday(new Date(booking.endDate))) &&
      isPast(new Date(booking.startDate)) &&
      !isToday(new Date(booking.startDate))
    )
      status = "checked-in";

    return {
      ...booking,
      numNights,
      cabinPrice,
      extrasPrice,
      totalPrice,
      guestId: allGuestIds.at(booking.guestId - 1),
      cabinId: allCabinIds.at(booking.cabinId - 1),
      status,
    };
  });

  console.log(finalBookings);

  const { error } = await supabase.from("bookings").insert(finalBookings);
  if (error) console.log(error.message);
}

// Componenta pentru încărcarea datelor
function Uploader() {
  const [isLoading, setIsLoading] = useState(false);
  // Funcția care încarcă toate datele
  async function uploadAll() {
    setIsLoading(true);
    // Datele de rezervări trebuie șterse mai întâi
    await deleteBookings();
    await deleteGuests();
    await deleteCabins();

    // Datele de rezervări trebuie create la final
    await createGuests();
    await createCabins();
    await createBookings();

    setIsLoading(false);
  }
  // Funcția care încarcă doar rezervările
  async function uploadBookings() {
    setIsLoading(true);
    await deleteBookings();
    await createBookings();
    setIsLoading(false);
  }

  return (
    <div
      style={{
        marginTop: "auto",
        backgroundColor: "#e0e7ff",
        padding: "8px",
        borderRadius: "5px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <HeaderUploader>SAMPLE DATA</HeaderUploader>
      <Button onClick={uploadAll} disabled={isLoading}>
        Upload ALL
      </Button>
      <Button onClick={uploadBookings} disabled={isLoading}>
        Upload bookings ONLY
      </Button>
      <Modal>
        <Modal.Open opens="tech-decisions">
          <Button>Technology decisions</Button>
        </Modal.Open>
        <Modal.Window name="tech-decisions">
          <TechModal />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default Uploader;
