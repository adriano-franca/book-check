import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { useDebounce } from "@/app/hooks/useDebounce";
import { searchOpenLibrary } from "@/features/search/searchService";

// Interfaces para os resultados da busca
interface LivroResultado {
  id: string; // ex: "/works/OL12345W"
  titulo: string;
  autor: string;
}
interface AutorResultado {
  id: string; // ex: "/authors/OL12345A"
  nome: string;
}
interface SearchResult {
  livros: LivroResultado[];
  autores: AutorResultado[];
}

// Itens do menu de navegação
const menuItems = [
    { label: "Início", href: "/" },
    { label: "Livros", href: "/livros" },
    { label: "Autores", href: "/autores" },
    { label: "Editoras", href: "/editoras" }
  ];

export function TopbarLayout() {
  const { user, clearAuth, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Estados para a funcionalidade de busca
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Hook para atrasar a busca e não sobrecarregar a API
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  // Efeito para realizar a busca quando o termo de pesquisa (debounced) muda
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

  // Função para logout do usuário
  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  // Função para limpar a busca ao clicar em um resultado
  const handleResultClick = () => {
    setSearchQuery('');
    setSearchResults(null);
    setIsSearchFocused(false);
  };

  return (
    <header className="flex items-center justify-between p-4 bg-blue-500 text-white border-b shadow-sm sticky top-0 z-50 gap-4">
      <Link to="/" className="text-2xl font-bold">
        BookCheck
      </Link>

      {/* Barra de busca visível apenas para usuários autenticados */}
      {isAuthenticated && (
        <div className="relative w-full max-w-md">
          <Input
            type="search"
            placeholder="Buscar livros e autores..."
            className="w-full bg-blue-400 border-blue-300 placeholder:text-blue-200 text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
          />
          {/* Dropdown de resultados da busca */}
          {isSearchFocused && searchQuery.length > 2 && (
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
                            // Link para a página de detalhes do livro
                            <Link
                              to={`/livro/${livro.id.replace("/works/", "")}`}
                              key={livro.id}
                              onClick={handleResultClick}
                              className="block px-3 py-2 text-sm hover:bg-accent cursor-pointer"
                            >
                              <div className="font-medium">{livro.titulo}</div>
                              <div className="text-xs text-muted-foreground">{livro.autor}</div>
                            </Link>
                          ))}
                        </div>
                      )}
                      {searchResults.autores.length > 0 && (
                        <div>
                          <h3 className="p-2 text-xs font-semibold text-muted-foreground border-b">AUTORES</h3>
                          {searchResults.autores.map(autor => (
                             // Link para a página de detalhes do autor
                            <Link
                              to={`/author/${autor.id.replace("/authors/", "")}`}
                              key={autor.id}
                              onClick={handleResultClick}
                              className="block px-3 py-2 text-sm hover:bg-accent cursor-pointer"
                            >
                              <div className="font-medium">{autor.nome}</div>
                            </Link>
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

      {/* Menu de navegação e perfil do usuário */}
      <div className="flex items-center gap-6">
        {isAuthenticated && (
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                {menuItems.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <Link to={item.href}>
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
