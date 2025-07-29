import { AppLayout } from "@/components/layout/AppLayout";
import { BookCardVertical } from "../components/BookCardVertical";
import { useLocation } from "react-router-dom";
import type { Book, BookCategory } from "@/@types/books";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";

export const handleBookClick = (bookId: string) => {
  window.location.href = `/livro/${bookId}`;
};

const mapOpenLibraryToBook = (doc: any): Book => ({
  id: doc.key?.replace("/works/", "") ?? crypto.randomUUID(),
  title: doc.title ?? "Sem título",
  author: doc.authors?.[0]?.name ?? doc.author_name?.[0] ?? "Desconhecido",
  description: "",
  coverImage: doc.cover_id
    ? `https://covers.openlibrary.org/b/id/${doc.cover_id}-M.jpg`
    : "/placeholder-book.jpg",
  year: doc.first_publish_year,
  isbn: doc.isbn?.[0],
  isbn10: doc.isbn?.find((i: string) => i.length === 10),
  publisher: doc.publisher?.[0],
});

export const renderSearchResults = (
  searchQuery: string,
  books: Book[],
  isLoading: boolean
) => {
  return (
    <div className="flex flex-col gap-2 w-[80%] max-w-[80%]">
      <h2>
        Resultados para: <span className="font-bold">{searchQuery}</span>
      </h2>
      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <div className="grid grid-cols-7 gap-2">
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
    <div className="flex flex-col gap-2 w-[80%] max-w-[80%]">
      {booksByCategory.map((category) => (
        <div key={category.id}>
          <h2 className="text-xl font-bold mb-2">{category.name}</h2>
          <Carousel opts={{ loop: true }}>
            <CarouselContent>
              {category.books.map((book: any) => (
                <CarouselItem
                  key={book.id}
                  className="md:basis-1/2 lg:basis-1/6"
                >
                  <BookCardVertical
                    book={book}
                    onClick={() => handleBookClick(book.id)}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      ))}
    </div>
  );
};

const CATEGORY_LIST = [
  { id: "fiction", name: "Ficção" },
  { id: "history", name: "História" },
  { id: "technology", name: "Tecnologia" },
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
        )}&limit=21`
      )
        .then((res) => res.json())
        .then((data) => {
          const mapped = data.docs.map(mapOpenLibraryToBook);
          setBooks(mapped);
        })
        .finally(() => setIsLoading(false));
    } else {
      Promise.all(
        CATEGORY_LIST.map(async (category) => {
          const res = await fetch(
            `https://openlibrary.org/subjects/${category.id}.json?limit=10`
          );
          const data = await res.json();
          const books = data.works?.map(mapOpenLibraryToBook) ?? [];
          return {
            id: category.id,
            name: category.name,
            books,
          } as BookCategory;
        })
      ).then(setBooksByCategory);
    }
  }, [searchQuery]);

  return (
    <AppLayout hideSidebar>
      <div className="flex-1 flex justify-center">
        {searchQuery
          ? renderSearchResults(searchQuery, books, isLoading)
          : renderByCategoryResults(booksByCategory)}
      </div>
    </AppLayout>
  );
};
