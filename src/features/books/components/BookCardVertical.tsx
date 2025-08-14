import type { Book } from "@/@types/books";

export const BookCardVertical = ({
  book,
  onClick,
}: {
  book?: any;
  onClick?: () => void;
}) => {
  return (
    <div
      className="w-44 text-center p-2 cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out"
      onClick={onClick}
    >
      <img
        src={book?.coverImage}
        alt={book?.title}
        className="w-full h-auto rounded"
      />
      <h3 className="mt-2 text-sm font-bold leading-snug text-black">
        {book?.title}
      </h3>
      <p className="text-xs font-semibold text-zinc-700">{book?.author}</p>
      <p className="text-xs text-zinc-600 italic">{book?.publisher}</p>
      {book?.price && (
        <p className="text-sm font-bold text-black mt-1">R$ {book?.price}</p>
      )}
    </div>
  );
};
