import type { Book } from "@/@types/books";
import { Button } from "@/components/ui/button";

export function BookExtensiveCard({
  book,
  type = "wishlist",
}: {
  book?: Book;
  type?: "bookcase" | "wishlist";
}) {
  return (
    <div className="flex rounded-lg shadow-md border border-black overflow-hidden">
      <img
        src={book?.coverImage}
        alt={book?.title}
        className="w-64 h-auto object-cover"
      />

      <div className="p-4 flex flex-col justify-between w-full">
        <div className="space-y-2">
          <div className="flex justify-between gap-1">
            <div>
              <h2 className="text-xl font-bold leading-tight text-zinc-900">
                {book?.title}
              </h2>
              <p className="text-sm text-zinc-700 font-semibold">
                {book?.author}
              </p>
            </div>
            {type === "bookcase" && (
              <div className="flex flex-col items-end">
                <p className="text-sm font-semibold text-zinc-700">
                  Avaliação: {book?.rating ? book.rating.toFixed(1) : "N/A"}/5h
                </p>
              </div>
            )}
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
          <Button className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-4 py-1.5 rounded-md">
            Buscar
          </Button>
        </div>
      </div>
    </div>
  );
}
