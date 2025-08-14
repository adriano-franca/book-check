import { AppLayout } from "@/components/layout/AppLayout";
import { BookCardVertical } from "../components/BookCardVertical";
import { useLocation } from "react-router-dom";
import type { Book, BookCategory } from "@/@types/books";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";

export const handleBookClick = (bookId: string) => {
  window.location.href = `/livro/${bookId}`;
};

const mapOpenLibraryToBook = (doc: any): Book => {
  const coverId = doc.cover_i || doc.cover_id;
  const isbn = doc.isbn?.[0];
  let coverImage = "/placeholder-book.jpg"; // Default fallback

  if (coverId) {
    coverImage = `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
  } else if (isbn) {
    coverImage = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
  }

  return {
    id: doc.key?.replace("/works/", "") ?? crypto.randomUUID(),
    title: doc.title ?? "Sem título",
    author: doc.authors?.[0]?.name ?? doc.author_name?.[0] ?? "Desconhecido",
    description: doc.description ?? "",
    coverImage,
    year: doc.first_publish_year,
    isbn: isbn,
    isbn10: doc.isbn?.find((i: string) => i.length === 10),
    publisher: doc.publisher?.[0],
  };
};

export const renderSearchResults = (
  searchQuery: string,
  books: Book[],
  isLoading: boolean
) => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-7xl px-4">
      <h2 className="text-xl font-bold">
        Resultados para: <span className="font-bold">{searchQuery}</span>
      </h2>
      {isLoading ? (
        <p className="text-gray-500">Carregando...</p>
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
  );
};

export const renderByCategoryResults = (booksByCategory: BookCategory[]) => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl px-4">
      {booksByCategory.map((category) => (
        <div key={category.id}>
          <h2 className="text-xl font-bold mb-2">{category.name}</h2>
          <Carousel
            opts={{ loop: true, align: "start" }}
            className="w-full"
          >
            <CarouselContent>
              {category.books.length === 0 ? (
                <CarouselItem>
                  <p className="text-gray-500">Nenhum livro disponível nesta categoria.</p>
                </CarouselItem>
              ) : (
                category.books.map((book: any) => (
                  <CarouselItem
                    key={book.id}
                    className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
                  >
                    <BookCardVertical
                      book={book}
                      onClick={() => handleBookClick(book.id)}
                    />
                  </CarouselItem>
                ))
              )}
            </CarouselContent>
            <CarouselPrevious className="ml-2" />
            <CarouselNext className="mr-2" />
          </Carousel>
        </div>
      ))}
    </div>
  );
};

const CATEGORY_LIST = [
  { id: "romance", name: "Romance" },
  { id: "science_fiction", name: "Ficção Científica" },
  { id: "nonfiction", name: "Não Ficção" },
  { id: "mystery", name: "Mistério" },
  { id: "classics", name: "Clássicos" },
  { id: "fantasy", name: "Fantasia" },
  { id: "biography", name: "Biografia" },
  { id: "young_adult_fiction", name: "Jovem Adulto" },
  { id: "horror", name: "Terror" },
  { id: "historical_fiction", name: "Ficção Histórica" },
];

export const BookListPage = () => {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const searchQuery = searchParams.get("search");

  const [books, setBooks] = useState<Book[]>([]);
  const [booksByCategory, setBooksByCategory] = useState<BookCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      setIsLoading(true);
      fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(
          searchQuery
        )}&limit=24&fields=key,title,author_name,cover_i,isbn,first_publish_year,publisher`
      )
        .then((res) => res.json())
        .then((data) => {
          const mapped = data.docs.map(mapOpenLibraryToBook);
          setBooks(mapped);
        })
        .catch((error) => {
          console.error("Erro ao buscar livros:", error);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(true);
      Promise.all(
        CATEGORY_LIST.map(async (category) => {
          try {
            const res = await fetch(
              `https://openlibrary.org/subjects/${category.id}.json?limit=12&fields=key,title,author_name,cover_i,isbn,first_publish_year,publisher`
            );
            const data = await res.json();
            const books = data.works?.map(mapOpenLibraryToBook) ?? [];
            return {
              id: category.id,
              name: category.name,
              books,
            } as BookCategory;
          } catch (error) {
            console.error(`Erro ao buscar categoria ${category.name}:`, error);
            return { id: category.id, name: category.name, books: [] };
          }
        })
      )
        .then(setBooksByCategory)
        .finally(() => setIsLoading(false));
    }
  }, [searchQuery]);

  return (
    <AppLayout hideSidebar>
      <div className="flex-1 flex justify-center py-6">
        {isLoading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : searchQuery ? (
          renderSearchResults(searchQuery, books, isLoading)
        ) : (
          renderByCategoryResults(booksByCategory)
        )}
      </div>
    </AppLayout>
  );
};