import api from "@/app/config/axios";

interface LoginPayload {
  username: string;
  password: string;
}

export const login = async ({ username, password }: LoginPayload) => {
  const response = await api.post("/auth/login", { username, password });
  return response.data; // espera-se { token, user }
};
