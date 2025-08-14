import type { Author } from "@/@types/authors";

export const AuthorCardVertical = ({ author, onClick }: { author?: Author, onClick?: () => void }) => {
  return (
    <div className="w-44 text-center p-2 cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out" onClick={onClick}>
      <img
        src={author?.coverImage}
        alt={author?.name}
        className="w-full h-auto rounded"
      />
      <h3 className="mt-2 text-sm font-bold leading-snug text-black">
        {author?.name}
      </h3>
    </div>
  )
}
