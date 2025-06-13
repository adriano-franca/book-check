import { AppLayout } from "@/components/layout/AppLayout";
import { BookCardVertical } from "../components/BookCardVertical";
import {
  books as dataBooks,
  booksByCategory as dataBooksByCategory,
} from "@/data/books";
import { useLocation } from "react-router-dom";
import type { Book, BookCategory } from "@/@types/books";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export const handleBookClick = (bookId: string) => {
  window.location.href = `/livro/${bookId}`;
}

export const renderSearchResults = (searchQuery: string, books: Book[]) => {
  return (
    <div className="flex flex-col gap-2 w-[80%] max-w-[80%]">
      <h2>
        Resultados para: <span className="font-bold">{searchQuery}</span>
      </h2>
      <div className="grid grid-cols-7 gap-2">
        {books.map((book) => (
          <BookCardVertical key={book.id} book={book} onClick={() => handleBookClick(book.id)} />
        ))}
      </div>
    </div>
  );
};

export const renderByCategoryResults = (booksByCategory: BookCategory[]) => {
  return (
    <div className="flex flex-col gap-2 w-[80%] max-w-[80%]">
      {booksByCategory.map((category) => (
        <div key={category.id}>
          <h2 className="text-xl font-bold mb-2">{category.name}</h2>
          <Carousel
            opts={{
              loop: true,
            }}
          >
            <CarouselContent>
              {category.books.map((book) => (
                <CarouselItem className="md:basis-1/2 lg:basis-1/6">
                  <BookCardVertical key={book.id} book={book} onClick={() => handleBookClick(book.id)} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      ))}
    </div>
  );
};

export const BookListPage = () => {
  const books = dataBooks;
  const booksByCategory = dataBooksByCategory;
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const searchQuery = searchParams.get("search");

  return (
    <AppLayout hideSidebar>
      <div className="flex-1 flex justify-center">
        {searchQuery && renderSearchResults(searchQuery, books)}
        {!searchQuery && renderByCategoryResults(booksByCategory)}
      </div>
    </AppLayout>
  );
};
