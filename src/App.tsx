import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./app/routes";
import { Toaster } from "sonner";
import { useAuthStore } from "./app/stores/authStore";
import { useEffect } from "react";

function App() {
  const { token, _hasHydrated, setHasHydrated } = useAuthStore();
  
  useEffect(() => {
    if (token) {
      useAuthStore.setState({ isAuthenticated: true });
    }
    setHasHydrated(true);
  }, [token, setHasHydrated]);


  if (!_hasHydrated) {
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