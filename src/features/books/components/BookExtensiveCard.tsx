import { useNavigate } from "react-router-dom";
import type { Book } from "@/@types/books";
import { Button } from "@/components/ui/button";

export function BookExtensiveCard({
  book,
  type = "wishlist",
}: {
  book?: Book;
  type?: "bookcase" | "wishlist";
}) {
  const navigate = useNavigate();

  // Função para navegar para a página de detalhes do livro
  const handleNavigateToDetails = () => {
    if (book?.id) {
      navigate(`/livro/${book.id}`);
    }
  };

  return (
    <div className="flex rounded-lg shadow-md border border-black overflow-hidden">
      <img
        src={book?.coverImage}
        alt={book?.title}
        className="w-64 h-auto object-cover cursor-pointer"
        onClick={handleNavigateToDetails} // Adiciona navegação ao clicar na imagem
      />

      <div className="p-4 flex flex-col justify-between w-full">
        <div className="space-y-2">
          <div className="flex justify-between gap-1">
            <div 
              className="cursor-pointer" 
              onClick={handleNavigateToDetails} // Adiciona navegação ao clicar no título/autor
            >
              <h2 className="text-xl font-bold leading-tight text-zinc-900">
                {book?.title}
              </h2>
              <p className="text-sm text-zinc-700 font-semibold">
                {book?.author}
              </p>
            </div>
          </div>
          <p className="text-sm text-zinc-800 leading-relaxed line-clamp-4">
            <strong className="font-semibold">Descrição:</strong>{" "}
            {book?.description}
          </p>
          {type === "bookcase" && (
            <p className="text-sm text-zinc-800 leading-relaxed line-clamp-4">
              <strong className="font-semibold">Comentários:</strong>{" "}
              {book?.comments}
            </p>
          )}
        </div>
        <div className="mt-4 text-right">
          {/* --- ALTERAÇÃO PRINCIPAL AQUI --- */}
          <Button
            className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-4 py-1.5 rounded-md"
            onClick={handleNavigateToDetails}
          >
            Ver Detalhes
          </Button>
        </div>
      </div>
    </div>
  );
}