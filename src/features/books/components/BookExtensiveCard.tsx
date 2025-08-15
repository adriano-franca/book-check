import { useNavigate } from "react-router-dom";
import type { Book } from "@/@types/books";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { CatalogoBook } from "@/features/sebo/services/catalogoService";

interface BookExtensiveCardProps {
  book?: Book | CatalogoBook;
  type?: "bookcase" | "wishlist" | "catalogo";
  onEdit?: (book: CatalogoBook) => void;
  onDelete?: (book: CatalogoBook) => void;
}

export function BookExtensiveCard({ book, type = "wishlist", onEdit, onDelete }: BookExtensiveCardProps) {
  const navigate = useNavigate();

  const handleNavigateToDetails = () => {
    if (book?.id) {
      navigate(`/livro/${book.id}`);
    }
  };
  
  const catalogoBook = book as CatalogoBook;

  return (
    <div className="flex rounded-lg shadow-md border border-black overflow-hidden bg-white">
      <img
        src={book?.coverImage}
        alt={book?.title}
        className="w-48 h-auto object-cover cursor-pointer"
        onClick={handleNavigateToDetails}
      />

      <div className="p-4 flex flex-col justify-between w-full">
        <div>
          <div className="flex justify-between gap-2">
            <div className="cursor-pointer" onClick={handleNavigateToDetails}>
              <h2 className="text-xl font-bold leading-tight text-zinc-900">{book?.title}</h2>
              <p className="text-sm text-zinc-700 font-semibold">{book?.author}</p>
            </div>
            
            {/* Botões de Ação para o Catálogo */}
            {type === 'catalogo' && (
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit?.(catalogoBook)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete?.(catalogoBook)}>
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            )}
          </div>

          <p className="text-sm text-zinc-800 leading-relaxed line-clamp-3 mt-2">
            {book?.description}
          </p>
          
          {/* Informações específicas do catálogo */}
          {type === 'catalogo' && (
            <div className="text-xs text-zinc-600 mt-2 space-y-1">
              <p><strong>Preço:</strong> R$ {catalogoBook.preco.toFixed(2)}</p>
              <p><strong>Quantidade:</strong> {catalogoBook.quantidade}</p>
              <p><strong>Estado:</strong> {catalogoBook.estadoConservacao}</p>
            </div>
          )}
        </div>
        
        <div className="mt-2 text-right">
          <Button onClick={handleNavigateToDetails} size="sm">Ver Detalhes</Button>
        </div>
      </div>
    </div>
  );
}