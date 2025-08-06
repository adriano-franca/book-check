import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { BookCardVertical } from "../../books/components/BookCardVertical";
import type { Book } from "@/@types/books";

interface AuthorDetail {
  name: string;
  bio?: string | { value: string };
  photos?: number[];
  birth_date?: string;
  death_date?: string;
}

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

export const AuthorDetailPage = () => {
  const navigate = useNavigate();
  const { id: authorId } = useParams<{ id: string }>();
  const [author, setAuthor] = useState<AuthorDetail | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [isBooksLoading, setIsBooksLoading] = useState(false);

  useEffect(() => {
    if (!authorId) return;

    const fetchAuthor = async () => {
      try {
        const res = await fetch(`https://openlibrary.org/authors/${authorId}.json`);
        const data = await res.json();
        setAuthor(data);
      } catch (error) {
        console.error("Erro ao buscar autor:", error);
      }
    };

    const fetchBooks = async () => {
      setIsBooksLoading(true);
      try {
        const res = await fetch(
          `https://openlibrary.org/search.json?author=${authorId}&limit=12&fields=key,title,author_name,cover_i,isbn,first_publish_year,publisher`
        );
        const data = await res.json();
        const mappedBooks = data.docs.map(mapOpenLibraryToBook);
        setBooks(mappedBooks);
      } catch (error) {
        console.error("Erro ao buscar livros do autor:", error);
      } finally {
        setIsBooksLoading(false);
      }
    };

    fetchAuthor();
    fetchBooks();
  }, [authorId]);

  const getPhotoImage = () => {
    if (author?.photos?.[0]) {
      return `https://covers.openlibrary.org/a/id/${author.photos[0]}-L.jpg`;
    }
    if (authorId) {
      return `https://covers.openlibrary.org/a/olid/${authorId}-L.jpg`;
    }
    console.warn(`Author ${author?.name || "unknown"} has no photo, using placeholder`);
    return "/placeholder-author.jpg";
  };

  const getBio = () => {
    if (!author?.bio) return "Sem descrição.";
    if (typeof author.bio === "string") return author.bio;
    return author.bio.value;
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

        {author ? (
          <div className="flex-1 flex flex-col items-center gap-10 p-10">
            <div className="flex items-center justify-center gap-10 w-full max-w-7xl">
              <img
                src={getPhotoImage()}
                alt={`Foto de ${author.name}`}
                className="w-[260px] rounded shadow-lg"
              />

              <div className="max-w-2xl">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold">{author.name}</h1>
                    <p className="text-sm text-sky-800 font-medium">Autor</p>

                    <div className="text-sm text-muted-foreground mt-2 leading-6">
                      {author.birth_date && (
                        <p>
                          <strong>Data de Nascimento:</strong> {author.birth_date}
                        </p>
                      )}
                      {author.death_date && (
                        <p>
                          <strong>Data de Falecimento:</strong> {author.death_date}
                        </p>
                      )}
                      <p>
                        <strong>ID:</strong> {authorId}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-black border border-blue-400 rounded-full">
                    OpenLibrary
                  </Badge>
                </div>

                <div className="mt-6">
                  <h2 className="text-xl font-bold border-b-2 border-sky-700 inline-block pb-1 mb-2">
                    Biografia
                  </h2>
                  <p className="text-sm leading-relaxed text-black">
                    {getBio()}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full max-w-7xl mt-8">
              <h2 className="text-xl font-bold border-b-2 border-sky-700 inline-block pb-1 mb-4">
                Livros do Autor
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
        ) : (
          <div className="text-center text-gray-500 mt-20">
            Carregando autor...
          </div>
        )}
      </div>
    </AppLayout>
  );
};