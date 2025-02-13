import styled from "styled-components";
import { useUser } from "../features/authentication/useUser";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  justify-content: center;
  align-items: center;
`;

function ProtectedRoute({ children }) {
  const navigate = useNavigate(); // Hook-ul pentru navigare
  // 1. Încărcăm utilizatorul autentificat
  const { isLoading, isAuthenticated } = useUser(); // Folosim useUser pentru a obține starea autentificării

  // 2. Dacă nu există un utilizator autentificat, redirecționăm către /login
  useEffect(
    function () {
      // Dacă nu este autentificat și nu este încărcat, redirecționăm
      if (!isAuthenticated && !isLoading) navigate("/login");
    },
    [navigate, isAuthenticated, isLoading] // Dependențe pentru a rula efectul atunci când se schimbă aceste valori
  );

  // 3. Dacă utilizatorul este în proces de autentificare, afișăm un spinner
  if (isLoading)
    return (
      <FullPage>
        <Spinner /> {/* Afișăm spinnerul de încărcare */}
      </FullPage>
    );

  // 4. Dacă există un utilizator autentificat, afișăm copilul componentei (contenutul protejat)
  if (isAuthenticated) return children;
}

export default ProtectedRoute;
