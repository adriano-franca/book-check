import { AppLayout } from "@/components/layout/AppLayout";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { BookStatusManager } from "../components/BookStatusManager";
import type { Book } from "@/@types/books";

interface BookDetailAPI {
  title: string;
  description?: string | { value: string };
  covers?: number[];
  authors?: { author: { key: string } }[];
}

interface AuthorAPI {
  name: string;
}

export const BookDetailPage = () => {
  const navigate = useNavigate();
  const { id: bookId } = useParams<{ id: string }>();

  const [bookData, setBookData] = useState<BookDetailAPI | null>(null);
  const [author, setAuthor] = useState<AuthorAPI | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!bookId) return;

    const fetchBook = async () => {
      setIsLoading(true);
      try {
        const bookRes = await fetch(`https://openlibrary.org/works/${bookId}.json`);
        const bookApiData = await bookRes.json();
        setBookData(bookApiData);

        const authorKey = bookApiData.authors?.[0]?.author?.key;
        if (authorKey) {
          const authorRes = await fetch(`https://openlibrary.org${authorKey}.json`);
          const authorApiData = await authorRes.json();
          setAuthor(authorApiData);
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do livro:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  const getCoverImage = () => {
    if (bookData?.covers?.[0]) {
      return `https://covers.openlibrary.org/b/id/${bookData.covers[0]}-L.jpg`;
    }
    return "https://placehold.co/400x600?text=Sem+Capa";
  };

  const getDescription = () => {
    if (!bookData?.description) return "Sem descrição.";
    if (typeof bookData.description === "string") return bookData.description;
    return bookData.description.value;
  };

  const bookForManager: Book | null = useMemo(() => {
    if (!bookData) return null;
    return {
      id: bookId!,
      title: bookData.title,
      author: author?.name ?? "Autor desconhecido",
      description: getDescription(),
      coverImage: getCoverImage(),
    };
  }, [bookData, author, bookId]);

  if (isLoading) {
    return (
      <AppLayout hideSidebar>
        <div className="text-center text-gray-500 mt-20">Carregando livro...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout hideSidebar>
      <div className="p-6">
        <a className="mb-6 flex items-center gap-2 cursor-pointer hover:text-sky-700" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Voltar
        </a>

        {bookData && bookForManager ? (
          <div className="flex-1 flex items-center justify-center gap-10 p-10">
            <img src={bookForManager.coverImage} alt="Capa do livro" className="w-[260px] rounded shadow-lg" />
            <div className="max-w-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">{bookForManager.title}</h1>
                  <p className="text-sm text-sky-800 font-medium">{bookForManager.author}</p>
                </div>
                <BookStatusManager book={bookForManager} />
              </div>
              <div className="mt-6">
                <h2 className="text-xl font-bold border-b-2 border-sky-700 inline-block pb-1 mb-2">Descrição</h2>
                <p className="text-sm leading-relaxed text-black">{bookForManager.description}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-20">Livro não encontrado.</div>
        )}
      </div>
    </AppLayout>
  );
};