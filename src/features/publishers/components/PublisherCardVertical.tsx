import type { Publisher } from "@/@types/publisher";

export const PublisherCardVertical = ({ publisher, onClick }: { publisher?: Publisher, onClick?: () => void }) => {
  return (
    <div className="w-44 text-center p-2 cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out" onClick={onClick}>
      <img
        src={publisher?.coverImage}
        alt={publisher?.name}
        className="w-full h-auto rounded"
      />
      <h3 className="mt-2 text-sm font-bold leading-snug text-black">
        {publisher?.name}
      </h3>
    </div>
  )
}
