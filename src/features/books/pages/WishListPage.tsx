import { AppLayout } from "@/components/layout/AppLayout";
import { BookExtensiveCard } from "../components/BookExtensiveCard";
import { books as dataBooks } from "@/data/books";

export const WishListPage = () => {
  const books = dataBooks;
  return (
    <AppLayout>
      {books.map((book) => (
        <BookExtensiveCard key={book.id} book={book} />
      ))}
    </AppLayout>
  );
};
