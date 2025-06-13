import { Input } from "../ui/input";

export const Topbar = () => {
  const items = [
    { label: "Início", href: "/" },
    { label: "Livros", href: "/livros" },
    { label: "Autores", href: "/autores" },
    { label: "Editoras", href: "/editoras" },
    { label: "Usuário", href: "/usuario" },
  ];
  return (
    <div className="bg-sky-500 p-4 flex items-center justify-between">
      <a href="/" className="flex items-center gap-2">
        <img src="/logo.png" alt="Book Network" className="w-10 h-10" />
      </a>
      <form className="min-w-md max-w-md">
        <Input
          placeholder="Livros, Autores, Editoras..."
          className="w-[100%] rounded-md bg-white"
          name="search"
          type="text"
        />
      </form>
      <nav className="flex gap-6 text-white font-medium">
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="text-sm text-white hover:underline transition-all duration-200"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
};
