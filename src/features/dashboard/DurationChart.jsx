import styled from "styled-components";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useDarkMode } from "../../context/DarkModeContext";
import Heading from "../../ui/Heading";

// STILIZARE COMPONENTE
const ChartBox = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  padding: 2.4rem 3.2rem;
  grid-column: 3 / span 2;

  & > *:first-child {
    margin-bottom: 1.6rem;
  }

  & .recharts-pie-label-text {
    font-weight: 600;
  }
`;

// Setările de date pentru modurile de culoare (light/dark)
const startDataLight = [
  { duration: "1 night", value: 0, color: "#ef4444" },
  { duration: "2 nights", value: 0, color: "#f97316" },
  { duration: "3 nights", value: 0, color: "#eab308" },
  { duration: "4-5 nights", value: 0, color: "#84cc16" },
  { duration: "6-7 nights", value: 0, color: "#22c55e" },
  { duration: "8-14 nights", value: 0, color: "#14b8a6" },
  { duration: "15-21 nights", value: 0, color: "#3b82f6" },
  { duration: "21+ nights", value: 0, color: "#a855f7" },
];

const startDataDark = [
  { duration: "1 night", value: 0, color: "#b91c1c" },
  { duration: "2 nights", value: 0, color: "#c2410c" },
  { duration: "3 nights", value: 0, color: "#a16207" },
  { duration: "4-5 nights", value: 0, color: "#4d7c0f" },
  { duration: "6-7 nights", value: 0, color: "#15803d" },
  { duration: "8-14 nights", value: 0, color: "#0f766e" },
  { duration: "15-21 nights", value: 0, color: "#1d4ed8" },
  { duration: "21+ nights", value: 0, color: "#7e22ce" },
];

// Funcția pentru pregătirea datelor (actualizează valorile pentru fiecare categorie)
function prepareData(startData, stays) {
  // Funcție ajutătoare pentru a incrementa valorile în array-ul de date
  function incArrayValue(arr, field) {
    return arr.map((obj) =>
      obj.duration === field ? { ...obj, value: obj.value + 1 } : obj
    );
  }

  // Iterează prin fiecare ședere și actualizează datele în funcție de numărul de nopți
  const data = stays
    .reduce((arr, cur) => {
      const num = cur.numNights; // Extrage numărul de nopți pentru fiecare ședere

      // Incrementăm valoarea corespunzătoare numărului de nopți
      if (num === 1) return incArrayValue(arr, "1 night");
      if (num === 2) return incArrayValue(arr, "2 nights");
      if (num === 3) return incArrayValue(arr, "3 nights");
      if ([4, 5].includes(num)) return incArrayValue(arr, "4-5 nights");
      if ([6, 7].includes(num)) return incArrayValue(arr, "6-7 nights");
      if (num >= 8 && num <= 14) return incArrayValue(arr, "8-14 nights");
      if (num >= 15 && num <= 21) return incArrayValue(arr, "15-21 nights");
      if (num >= 21) return incArrayValue(arr, "21+ nights");

      return arr; // Dacă nu se potrivește nici o condiție, returnăm array-ul neschimbat
    }, startData) // începe cu datele inițiale din `startData`
    .filter((obj) => obj.value > 0); // Filtrează datele pentru a include doar categoriile cu valori > 0

  return data; // Returnează datele procesate
}

// Componenta principală pentru graficul de durată al șederii
function DurationChart({ confirmedStays }) {
  const { isDarkMode } = useDarkMode(); // Verifică dacă este activat modul dark
  const startData = isDarkMode ? startDataDark : startDataLight; // Alege setul de date în funcție de modul activ
  const data = prepareData(startData, confirmedStays);

  return (
    <ChartBox>
      <Heading as="h2">Stay duration summary</Heading> {/* Titlul graficului */}
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data} // Datele care vor fi afișate în grafic
            nameKey="duration" // Cheia pentru etichetele secțiunilor
            dataKey="value" // Cheia pentru valorile secțiunilor
            innerRadius={85} // Raza interioară a cercului
            outerRadius={110} // Raza exterioară a cercului
            cx="40%" // Poziția pe axa X a centrului cercului
            cy="50%" // Poziția pe axa Y a centrului cercului
            paddingAngle={3} // Unghiul de separare între secțiuni
          >
            {/* Pentru fiecare intrare din date, definește o culoare pentru secțiune */}
            {data.map((entry) => (
              <Cell
                fill={entry.color} // Culoarea secțiunii
                stroke={entry.color} // Culoarea marginii secțiunii
                key={entry.duration} // Cheia pentru fiecare celulă
              />
            ))}
          </Pie>
          <Tooltip /> {/* Tooltip-ul care apare la hover */}
          <Legend
            verticalAlign="middle" // Alinierea verticală a legendei
            align="right" // Alinierea pe axa X a legendei
            width="30%" // Lățimea legendei
            layout="vertical" // Dispunerea legendei pe verticală
            iconSize={15} // Dimensiunea icoanelor din legendă
            iconType="circle" // Tipul icoanei (cerc)
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartBox>
  );
}

export default DurationChart;
