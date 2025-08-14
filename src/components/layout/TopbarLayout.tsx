import { Link, useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAuthStore } from "@/app/stores/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState, useEffect } from "react";
import { useDebounce } from "@/app/hooks/useDebounce";
import { searchOpenLibrary } from "@/features/search/searchService";

// Tipos de Resultado da Busca
interface LivroResultado {
  id: string;
  titulo: string;
  autor: string;
}
interface AutorResultado {
  id: string;
  nome: string;
}
interface SearchResult {
  livros: LivroResultado[];
  autores: AutorResultado[];
}

// Itens do menu de navegação principal
const menuItems = [
  { href: "/", label: "Início" },
  { href: "/books", label: "Livros" },
  { href: "/authors", label: "Autores" },
  { href: "/publishers", label: "Editoras" },
];

export function TopbarLayout() {
  const { user, clearAuth, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchQuery.length > 2) {
        setIsSearchLoading(true);
        try {
          const results = await searchOpenLibrary(debouncedSearchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error("Erro na busca:", error);
          setSearchResults(null);
        } finally {
          setIsSearchLoading(false);
        }
      } else {
        setSearchResults(null);
      }
    };
    performSearch();
  }, [debouncedSearchQuery]);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const handleResultClick = () => {
    setSearchQuery('');
    setSearchResults(null);
    setIsSearchFocused(false);
  };

  return (
    // ALTERAÇÃO 1: Cor de fundo alterada para azul e texto principal para branco
    <header className="flex items-center justify-between p-4 bg-blue-500 text-white border-b shadow-sm sticky top-0 z-50 gap-4">
      <Link to="/" className="text-2xl font-bold"> {/* Cor do link herdará 'text-white' do header */}
        BookCheck
      </Link>

      {isAuthenticated && (
        <div className="relative w-full max-w-md">
          {/* A cor do texto do input foi ajustada para melhor contraste */}
          <Input
            type="search"
            placeholder="Buscar livros e autores..."
            className="w-full bg-blue-400 border-blue-300 placeholder:text-blue-200 text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
          />
          {isSearchFocused && searchQuery.length > 2 && (
            // O dropdown de busca continua com fundo e texto padrão para legibilidade
            <div className="absolute z-10 w-full mt-1 bg-card text-card-foreground border rounded-md shadow-lg max-h-96 overflow-y-auto">
              {isSearchLoading ? (
                <div className="p-3 text-sm text-center text-muted-foreground">Buscando...</div>
              ) : (
                <>
                  {searchResults && (searchResults.livros.length > 0 || searchResults.autores.length > 0) ? (
                    <>
                      {searchResults.livros.length > 0 && (
                        <div>
                          <h3 className="p-2 text-xs font-semibold text-muted-foreground border-b">LIVROS</h3>
                          {searchResults.livros.map(livro => (
                            <a href={`https://openlibrary.org${livro.id}`} target="_blank" rel="noopener noreferrer" key={livro.id} onClick={handleResultClick} className="block px-3 py-2 text-sm hover:bg-accent cursor-pointer">
                              <div className="font-medium">{livro.titulo}</div>
                              <div className="text-xs text-muted-foreground">{livro.autor}</div>
                            </a>
                          ))}
                        </div>
                      )}
                      {searchResults.autores.length > 0 && (
                         <div>
                          <h3 className="p-2 text-xs font-semibold text-muted-foreground border-b">AUTORES</h3>
                          {searchResults.autores.map(autor => (
                            <a href={`https://openlibrary.org${autor.id}`} target="_blank" rel="noopener noreferrer" key={autor.id} onClick={handleResultClick} className="block px-3 py-2 text-sm hover:bg-accent cursor-pointer">
                              <div className="font-medium">{autor.nome}</div>
                            </a>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="p-3 text-sm text-center text-muted-foreground">Nenhum resultado encontrado.</div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* ALTERAÇÃO 2: Agrupando o Menu de Navegação e o Perfil do Usuário */}
      <div className="flex items-center gap-6">
        {isAuthenticated && (
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                {menuItems.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <Link to={item.href}>
                      {/* Adicionado estilo para links brancos */}
                      <NavigationMenuLink className={`${navigationMenuTriggerStyle()} bg-transparent text-white hover:bg-blue-700 focus:bg-blue-700`}>
                        {item.label}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
        )}
        
        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={`https://i.pravatar.cc/150?u=${user.id}`} />
                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>Perfil</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={() => navigate("/login")} variant="secondary">Entrar</Button>
        )}
      </div>
    </header>
  );
}