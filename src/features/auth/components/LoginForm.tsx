import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/app/stores/authStore";
import { login } from "../services/authService";
import { toast } from "sonner";

export const LoginForm = ({
  className,
  ...props
}: React.ComponentProps<"form">) => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: () => login({ username: email, password }),
    onSuccess: (data) => {
      const { token, user } = data;
      if (token) {
        setAuth(token, user);
        navigate("/");
      } else {
        toast.error("Token não recebido.");
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Erro ao fazer login.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Seja Bem Vindo!</h1>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Senha</Label>
          </div>
          <div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 text-right hover:underline"
            >
              Esqueci minha senha
            </a>
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Entrando..." : "Login"}
        </Button>
        <a
            href="/register"
            className="ml-auto text-sm underline-offset-4 text-right hover:underline"
        >
          Não possui conta?
        </a>
      </div>
    </form>
  );
};
