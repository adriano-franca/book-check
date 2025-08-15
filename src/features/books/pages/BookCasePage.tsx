import { AppLayout } from "@/components/layout/AppLayout";
import { BookExtensiveCard } from "../components/BookExtensiveCard";
import { BookCaseStatusMenu } from "../components/BookCaseStatusMenu";
import { useEffect, useState, useMemo } from "react";
import { useAuthStore } from "@/app/stores/authStore";
import { getBiblioteca, type BibliotecaBook, StatusLeitura } from "../services/bibliotecaService";
import { toast } from "sonner";


// Mapeia os labels do menu para os enums do serviço, facilitando a filtragem
const statusMap: { [key: string]: StatusLeitura } = {
  "Lidos": StatusLeitura.COMPLETO,
  "Lendo": StatusLeitura.EM_ANDAMENTO,
  "Quero Ler": StatusLeitura.NAO_INICIADO,
  "Relendo": StatusLeitura.RELENDO,
  "Abandonei": StatusLeitura.ABANDONADO,
};

// Mapeia os enums de volta para os labels para destacar o filtro ativo
const statusLabels = {
  [StatusLeitura.COMPLETO]: "Lidos",
  [StatusLeitura.EM_ANDAMENTO]: "Lendo",
  [StatusLeitura.NAO_INICIADO]: "Quero Ler",
  [StatusLeitura.RELENDO]: "Relendo",
  [StatusLeitura.ABANDONADO]: "Abandonei",
};


export const BookCasePage = () => {
  const { user } = useAuthStore();
  const [allBooks, setAllBooks] = useState<BibliotecaBook[]>([]);
  const [activeFilter, setActiveFilter] = useState<StatusLeitura | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBiblioteca = async () => {
      if (!user?.id) return;
      try {
        setIsLoading(true);
        const books = await getBiblioteca(user.id);
        setAllBooks(books);
      } catch (error) {
        toast.error("Erro ao carregar sua estante.");
        console.error("Erro ao buscar biblioteca:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBiblioteca();
  }, [user]);

  // Filtra os livros com base no status ativo, ou retorna todos se nenhum filtro estiver ativo
  const filteredBooks = useMemo(() => {
    if (!activeFilter) {
      return allBooks;
    }
    return allBooks.filter((book) => book.statusLeitura === activeFilter);
  }, [allBooks, activeFilter]);

  // Função para lidar com o clique nos botões de filtro do menu
  const handleFilterChange = (label: string) => {
    const newStatus = statusMap[label];
    // Se o filtro clicado já estiver ativo, desativa o filtro. Senão, ativa o novo.
    setActiveFilter(currentStatus => currentStatus === newStatus ? null : newStatus);
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-3 max-w-4xl">
        <BookCaseStatusMenu 
          onFilterClick={handleFilterChange} 
          activeFilterLabel={activeFilter ? statusLabels[activeFilter] : undefined}
        />

        {isLoading ? (
          <p className="text-center text-muted-foreground mt-4">Carregando sua estante...</p>
        ) : filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <BookExtensiveCard key={book.bibliotecaId} book={book} type="bookcase" />
          ))
        ) : (
          <p className="text-center text-muted-foreground mt-4">
            {activeFilter ? "Nenhum livro encontrado com este status." : "Sua estante está vazia."}
          </p>
        )}
      </div>
    </AppLayout>
  );
};