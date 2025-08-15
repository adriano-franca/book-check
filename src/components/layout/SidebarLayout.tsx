import { cn } from "@/lib/utils";
import { Home, BookOpen, Bookmark, LogOut, MapPin, Library } from "lucide-react";
import { useAuthStore } from "@/app/stores/authStore";
import React from "react";
import { useNavigate } from "react-router-dom"; // 1. Importar o useNavigate

interface MenuItem {
  icon: React.ReactElement;
  label: string;
  href: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const SidebarLayout = () => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate(); // 2. Inicializar o hook
  const isSebo = user?.tipoUsuario === 'SEBO';

  const baseItems: MenuItem[] = [
    { icon: <Home size={24} />, label: "Home", href: "/" },
    { icon: <MapPin size={24} />, label: "Livrarias Próximas", href: "/livrarias-proximas" },
  ];

  const leitorItems: MenuItem[] = [
    { icon: <Bookmark size={24} />, label: "Lista de Desejos", href: "/lista-de-desejos" },
    { icon: <BookOpen size={24} />, label: "Estante", href: "/estante" },
  ];

  const seboItems: MenuItem[] = [
    { icon: <Library size={24} />, label: "Gerenciar Catálogo", href: "/sebo/catalogo" },
  ];

  const finalItems: MenuItem[] = [
    {
      icon: <LogOut size={24} />,
      label: "Sair",
      href: "/login",
      // 3. Usar o navigate para o logout
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        clearAuth();
        navigate("/login", { replace: true }); // Navegação mais limpa
      },
    }
  ];

  const items = [...baseItems, ...(isSebo ? seboItems : leitorItems), ...finalItems];

  const isActive = (href: string) => {
    const currentPath = window.location.pathname;
    if (href === "/") {
        return currentPath === "/";
    }
    return currentPath.startsWith(href);
  };

  return (
    <aside className="w-100 p-6 flex flex-col gap-6 text-blue-800 font-medium ml-4">
      <nav className="fixed flex flex-col gap-4 mt-25">
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-2 text-sm text-sky-500 hover:text-sky-700",
              { "text-blue-600 text-lg": isActive(item.href) }
            )}
            onClick={item.onClick}
          >
            {item.icon} {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
};