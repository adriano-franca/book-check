import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface BookDetail {
  title: string;
  description?: string | { value: string };
  covers?: number[];
  created?: { value: string };
  authors?: { author: { key: string } }[];
}

interface Author {
  name: string;
}

export const BookDetailPage = () => {
  const navigate = useNavigate();
  const { id: bookId } = useParams<{ id: string }>();
  const [book, setBook] = useState<BookDetail | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);

  useEffect(() => {
    if (!bookId) return;

    const fetchBook = async () => {
      const res = await fetch(`https://openlibrary.org/works/${bookId}.json`);
      const data = await res.json();
      setBook(data);

      const authorKey = data.authors?.[0]?.author?.key;
      if (authorKey) {
        const authorRes = await fetch(
          `https://openlibrary.org${authorKey}.json`
        );
        const authorData = await authorRes.json();
        setAuthor(authorData);
      }
    };

    fetchBook();
  }, [bookId]);

  const getCoverImage = () => {
    if (book?.covers?.[0]) {
      return `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`;
    }
    return "https://placehold.co/400x600?text=Sem+Capa";
  };

  const getDescription = () => {
    if (!book?.description) return "Sem descrição.";
    if (typeof book.description === "string") return book.description;
    return book.description.value;
  };

  const createdAt = book?.created?.value?.split("T")[0];

  return (
    <AppLayout hideSidebar>
      <div className="p-6">
        <a
          className="mb-6 flex items-center gap-2 cursor-pointer hover:text-sky-700 transition-colors duration-200"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
          Voltar
        </a>

        {book ? (
          <div className="flex-1 flex items-center justify-center gap-10 p-10">
            <img
              src={getCoverImage()}
              alt="Capa do livro"
              className="w-[260px] rounded shadow-lg"
            />

            <div className="max-w-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">{book.title}</h1>
                  <p className="text-sm text-sky-800 font-medium">
                    {author?.name ?? "Autor desconhecido"}
                  </p>

                  <div className="text-sm text-muted-foreground mt-2 leading-6">
                    {createdAt && (
                      <p>
                        <strong>Adicionado em:</strong> {createdAt}
                      </p>
                    )}
                    <p>
                      <strong>ID:</strong> {bookId}
                    </p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-black border border-blue-400 rounded-full">
                  OpenLibrary
                </Badge>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-bold border-b-2 border-sky-700 inline-block pb-1 mb-2">
                  Descrição
                </h2>
                <p className="text-sm leading-relaxed text-black">
                  {getDescription()}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-20">
            Carregando livro...
          </div>
        )}
      </div>
    </AppLayout>
  );
};
