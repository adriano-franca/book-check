import { useRoutes } from "react-router-dom";
import { publicRoutes } from "./publicRoutes";
import { authRoutes } from "./authRoutes";

export const AppRoutes = () => {
  const routes = useRoutes([...publicRoutes, ...authRoutes]);
  
  return routes;
}