import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./app/routes";
import { Toaster } from "sonner";
import { useAuthStore } from "./app/stores/authStore";
import { useEffect } from "react";

function App() {
  const { isAuthenticated, token, _hasHydrated, setHasHydrated } = useAuthStore();
  
  useEffect(() => {
    // Se o token existe após o carregamento inicial, garantimos que o estado está hidratado
    if (token) {
      useAuthStore.setState({ isAuthenticated: true });
    }
    // Marcamos a hidratação como concluída para remover a tela de loading
    setHasHydrated(true);
  }, [token, setHasHydrated]);


  if (!_hasHydrated) {
    // Você pode substituir isso por um componente de spinner/loading mais bonito
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Carregando...
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;