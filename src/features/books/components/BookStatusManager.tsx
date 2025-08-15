import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/app/stores/authStore";
import {
  addToBiblioteca,
  updateInBiblioteca,
  getBiblioteca,
  StatusLeitura,
  EstadoConservacao,
  type BibliotecaBook,
} from "../services/bibliotecaService";
import { toast } from "sonner";
import type { Book } from "@/@types/books";

interface BookStatusManagerProps {
  book: Book;
}

const statusLabels: { [key in StatusLeitura]: string } = {
  [StatusLeitura.COMPLETO]: "Lido",
  [StatusLeitura.EM_ANDAMENTO]: "Lendo",
  [StatusLeitura.NAO_INICIADO]: "Quero Ler",
  [StatusLeitura.RELENDO]: "Relendo",
  [StatusLeitura.ABANDONADO]: "Abandonei",
  [StatusLeitura.PAUSADO]: "Pausado",
};

export const BookStatusManager = ({ book }: BookStatusManagerProps) => {
  const { user } = useAuthStore();
  const [bibliotecaItem, setBibliotecaItem] = useState<BibliotecaBook | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookStatus = async () => {
      if (!user?.id || !book.id) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const biblioteca = await getBiblioteca(user.id);
        const item = biblioteca.find((b) => b.id === book.id);
        setBibliotecaItem(item || null);
      } catch (error) {
        console.error("Erro ao buscar status do livro na biblioteca:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookStatus();
  }, [book.id, user]);

  const handleStatusChange = async (newStatus: StatusLeitura) => {
    if (!user?.id || !book.id) {
      toast.error("Você precisa estar logado para realizar esta ação.");
      return;
    }

    try {
      if (bibliotecaItem) {
        const updatedData = await updateInBiblioteca(bibliotecaItem.bibliotecaId, {
          statusLeitura: newStatus,
          estadoConservacao: bibliotecaItem.estadoConservacao,
        });

        setBibliotecaItem(prevState => ({
            ...prevState!,
            statusLeitura: updatedData.statusLeitura,
            estadoConservacao: updatedData.estadoConservacao,
        }));

        toast.success(`Status do livro atualizado para "${statusLabels[newStatus]}"!`);

      } else {
        const newData = await addToBiblioteca({
          leitorId: user.id,
          workId: book.id,
          statusLeitura: newStatus,
          estadoConservacao: EstadoConservacao.BOM,
        });
        
        setBibliotecaItem({
            ...book,
            bibliotecaId: newData.id,
            statusLeitura: newData.statusLeitura,
            estadoConservacao: newData.estadoConservacao,
        });

        toast.success(`Livro adicionado à estante como "${statusLabels[newStatus]}"!`);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Erro ao atualizar o livro na estante.";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return <Button disabled>Carregando...</Button>;
  }

  const currentStatusLabel = bibliotecaItem?.statusLeitura
    ? statusLabels[bibliotecaItem.statusLeitura]
    : "Adicionar à Estante";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-sky-500 hover:bg-sky-600 text-white font-semibold">
          {currentStatusLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.entries(statusLabels).map(([statusKey, label]) => (
          <DropdownMenuItem
            key={statusKey}
            onSelect={() => handleStatusChange(statusKey as StatusLeitura)}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};