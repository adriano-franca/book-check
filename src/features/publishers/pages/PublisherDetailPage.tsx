import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { BookCardVertical } from "../../books/components/BookCardVertical";
import type { Book } from "@/@types/books";

const mapOpenLibraryToBook = (doc: any): Book => {
  const coverId = doc.cover_i;
  const isbn = doc.isbn?.[0];
  let coverImage = "/placeholder-book.jpg";

  if (coverId) {
    coverImage = `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
  } else if (isbn) {
    coverImage = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
  } else {
    console.warn(`Book ${doc.title || "unknown"} has no cover, using placeholder`);
  }

  return {
    id: doc.key?.replace("/works/", "") ?? crypto.randomUUID(),
    title: doc.title ?? "Sem título",
    author: doc.author_name?.[0] ?? "Desconhecido",
    description: "",
    coverImage,
    year: doc.first_publish_year,
    isbn: isbn,
    isbn10: doc.isbn?.find((i: string) => i.length === 10),
    publisher: doc.publisher?.[0],
  };
};

const TopBookHighlight = ({ book }: { book: Book }) => (
  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
    <h3 className="text-lg font-bold mb-2">Livro em Destaque</h3>
    <div className="flex items-center gap-4">
      <img src={book.coverImage} alt={book.title} className="w-[100px] rounded" />
      <div>
        <p className="font-semibold">{book.title}</p>
        <p className="text-sm text-gray-600">{book.author}</p>
        {book.year && <p className="text-sm">Publicado em: {book.year}</p>}
      </div>
    </div>
  </div>
);

export const PublisherDetailPage = () => {
  const navigate = useNavigate();
  const { id: publisherId } = useParams<{ id: string }>();
  const [publisherName, setPublisherName] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [isBooksLoading, setIsBooksLoading] = useState(false);

  useEffect(() => {
    if (!publisherId) return;

    const fetchPublisherBooks = async () => {
      setIsBooksLoading(true);
      try {
        const decodedPublisher = decodeURIComponent(publisherId).replace(/-/g, " ");
        setPublisherName(decodedPublisher);
        
        const res = await fetch(
          `https://openlibrary.org/search.json?publisher=${encodeURIComponent(
            `"${decodedPublisher}"`  
          )}&limit=13&fields=key,title,author_name,cover_i,isbn,first_publish_year,publisher,ratings_average`
        );
        
        const data = await res.json();
        
        const mappedBooks = data.docs
          .filter((doc: any) => 
            doc.publisher && 
            doc.publisher.some((pub: string) => 
              pub.toLowerCase() === decodedPublisher.toLowerCase()
            )
          )
          .map(mapOpenLibraryToBook);
          
        setBooks(mappedBooks);
      } catch (error) {
        console.error("Erro ao buscar livros da editora:", error);
      } finally {
        setIsBooksLoading(false);
      }
    };

    fetchPublisherBooks();
  }, [publisherId]);

  const getTopBook = () => {
    if (!books.length) return null;
    return books.reduce((prev, curr) => 
      (curr.ratings_average || 0) > (prev.ratings_average || 0) ? curr : prev, books[0]
    );
  };

  const handleBookClick = (bookId: string) => {
    navigate(`/livro/${bookId}`);
  };

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

        {publisherName ? (
          <div className="flex-1 flex flex-col items-center gap-10 p-10">
            <div className="w-full max-w-7xl">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">{publisherName}</h1>
                  <p className="text-sm text-sky-800 font-medium">Editora</p>
                </div>
                <Badge className="bg-blue-100 text-black border border-blue-400 rounded-full">
                  OpenLibrary
                </Badge>
              </div>

              {getTopBook() && (
                <TopBookHighlight book={getTopBook()!} />
              )}

              <div className="mt-8">
                <h2 className="text-xl font-bold border-b-2 border-sky-700 inline-block pb-1 mb-4">
                  Livros Publicados
                </h2>
                {isBooksLoading ? (
                  <p className="text-gray-500">Carregando livros...</p>
                ) : books.length === 0 ? (
                  <p className="text-gray-500">Nenhum livro encontrado.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {books.map((book) => (
                      <BookCardVertical
                        key={book.id}
                        book={book}
                        onClick={() => handleBookClick(book.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-20">
            Carregando editora...
          </div>
        )}
      </div>
    </AppLayout>
  );
};