import { AppLayout } from "@/components/layout/AppLayout";
import { BookExtensiveCard } from "../components/BookExtensiveCard";
import { books as dataBooks } from "@/data/books";
import { BookCaseStatusMenu } from "../components/BookCaseStatusMenu";

export const BookCasePage = () => {
  const books = dataBooks;
  return (
    <AppLayout>
      <div className="flex flex-col gap-3 max-w-4xl">
        <BookCaseStatusMenu />

        {books.map((book) => (
          <BookExtensiveCard key={book.id} book={book} type="bookcase" />
        ))}
      </div>
    </AppLayout>
  );
};
