import { cn } from "@/lib/utils";

const bookCaseItems = [
  { label: "Lidos", color: "text-green-600", src: "/bookcase-green.svg" },
  { label: "Lendo", color: "text-yellow-500", src: "/bookcase-yellow.svg" },
  { label: "Quero Ler", color: "text-blue-600", src: "/bookcase-blue.svg" },
  { label: "Relendo", color: "text-orange-500", src: "/bookcase-orange.svg" },
  { label: "Abandonei", color: "text-black", src: "/bookcase-black.svg" },
];

interface BookCaseStatusMenuProps {
  onFilterClick: (label: string) => void;
  activeFilterLabel?: string;
}

export const BookCaseStatusMenu = ({ onFilterClick, activeFilterLabel }: BookCaseStatusMenuProps) => {
  return (
    <div className="flex items-center justify-between gap-6 p-2 rounded bg-gray-100">
      {bookCaseItems.map((item) => (
        <div
          key={item.label}
          className={cn(
            "flex flex-col items-center text-xs cursor-pointer hover:scale-105 transition-transform p-2 rounded-md",
            { "bg-blue-200 scale-105": activeFilterLabel === item.label }
          )}
          onClick={() => onFilterClick(item.label)}
        >
          <img src={item.src} alt={item.label} className="w-8 h-8" />
          <span className={`mt-1 font-medium ${item.color}`}>{item.label}</span>
        </div>
      ))}
    </div>
  );
};