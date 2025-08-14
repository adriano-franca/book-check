import { LoginPage } from "@/features/auth/pages/LoginPage";
import { type RouteObject } from "react-router-dom";

export const publicRoutes: RouteObject[] = [
  {
    path: "/login",
    element: <LoginPage />,
  },
];
