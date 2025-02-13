import styled from "styled-components";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDarkMode } from "../../context/DarkModeContext";
import DashboardBox from "./DashboardBox";
import Heading from "../../ui/Heading";

// STILIZARE COMPONENTE
const StyledSalesChart = styled(DashboardBox)`
  grid-column: 1 / -1;

  /* Hack pentru a schimba culorile liniilor grilei */
  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300); /* Culoare gri pentru grilă */
  }
`;

function SalesChart({ bookings, numDays }) {
  // Preia starea Dark Mode din context
  const { isDarkMode } = useDarkMode();

  // Generează intervalul de date pentru ultimele `numDays` zile
  const allDates = eachDayOfInterval({
    start: subDays(new Date(), numDays - 1), // Startul intervalului
    end: new Date(), // Sfârșitul intervalului este astăzi
  });

  // Crează datele pentru graficul de vânzări
  const data = allDates.map((date) => {
    return {
      label: format(date, "MMM dd"), // Eticheta datelor formatată (ex: Jan 01)
      totalSales: bookings
        .filter((booking) => isSameDay(date, new Date(booking.created_at))) // Filtrăm pentru fiecare zi
        .reduce((acc, cur) => acc + cur.totalPrice, 0), // Calculăm suma totală a vânzărilor pentru acea zi
      extrasSales: bookings
        .filter((booking) => isSameDay(date, new Date(booking.created_at)))
        .reduce((acc, cur) => acc + cur.extrasPrice, 0), // Calculăm suma vânzărilor de extra pentru acea zi
    };
  });

  // Setarea culorilor în funcție de Dark Mode
  const colors = isDarkMode
    ? {
        totalSales: { stroke: "#4f46e5", fill: "#4f46e5" },
        extrasSales: { stroke: "#22c55e", fill: "#22c55e" },
        text: "#e5e7eb",
        background: "#18212f",
      }
    : {
        totalSales: { stroke: "#4f46e5", fill: "#c7d2fe" },
        extrasSales: { stroke: "#16a34a", fill: "#dcfce7" },
        text: "#374151",
        background: "#fff",
      };

  return (
    <StyledSalesChart>
      {/* Titlul graficului care indică intervalul de date */}
      <Heading as="h2">
        Sales from {format(allDates.at(0), "MMM dd yyyy")} &mdash;{" "}
        {format(allDates.at(-1), "MMM dd yyyy")}{" "}
      </Heading>

      {/* Container responsive pentru grafic */}
      <ResponsiveContainer height={300} width="100%">
        <AreaChart data={data}>
          {/* Axe X și Y pentru grafic */}
          <XAxis
            dataKey="label"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <YAxis
            unit="$"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          {/* Grilă pentru grafic */}
          <CartesianGrid strokeDasharray="4" />
          {/* Tooltip pentru afișarea informațiilor când treci cu mouse-ul */}
          <Tooltip contentStyle={{ backgroundColor: colors.background }} />
          {/* Graficul pentru vânzările totale */}
          <Area
            dataKey="totalSales"
            type="monotone"
            stroke={colors.totalSales.stroke}
            fill={colors.totalSales.fill}
            strokeWidth={2}
            name="Total sales"
            unit="$"
          />
          {/* Graficul pentru vânzările extra */}
          <Area
            dataKey="extrasSales"
            type="monotone"
            stroke={colors.extrasSales.stroke}
            fill={colors.extrasSales.fill}
            strokeWidth={2}
            name="Extras sales"
            unit="$"
          />
        </AreaChart>
      </ResponsiveContainer>
    </StyledSalesChart>
  );
}

export default SalesChart;
