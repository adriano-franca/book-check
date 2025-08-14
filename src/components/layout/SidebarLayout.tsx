import { cn } from "@/lib/utils";
import { Home, BookOpen, Bookmark, LogOut, MapPin } from "lucide-react";


export const SidebarLayout = () => {
  const items = [
    {
      icon: <Home size={24} />,
      label: "Home",
      href: "/",
    },
    {
      icon: <MapPin size={24} />,
      label: "Livrarias Próximas",
      href: "/livrarias-proximas",
    },
    {
      icon: <Bookmark size={24} />,
      label: "Lista de Desejos",
      href: "/lista-de-desejos",
    },
    {
      icon: <BookOpen size={24} />,
      label: "Estante",
      href: "/estante",
    },
    {
      icon: <LogOut size={24} />,
      label: "Sair",
      href: "/sair",
      onclick: (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.location.href = "/login"; // Redirect to login page
      },
    }
  ];

  const isActive = (href: string) => {
    return window.location.pathname === href;
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
              {
                "text-blue-600 text-lg": isActive(item.href),
              }
            )}
            onClick={item?.onclick}
          >
            {item.icon} {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
};
