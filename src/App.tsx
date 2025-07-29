import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./app/routes";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
      />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;
