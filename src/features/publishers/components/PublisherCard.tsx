import type { Publisher } from "@/@types/publishers";

interface PublisherCardProps {
  publisher: Publisher;
  onClick: () => void;
}

export const PublisherCard = ({ publisher, onClick }: PublisherCardProps) => (
  <div
    onClick={onClick}
    className="cursor-pointer p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-blue-50 transition-colors duration-200"
  >
    <p className="text-center font-semibold text-gray-800">{publisher.name}</p>
  </div>
);