import { AppLayout } from "@/components/layout/AppLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Publisher, PublisherCategory } from "@/@types/publisher";
import { PublisherCard } from "../components/PublisherCard";

export const handlePublisherClick = (publisherId: string, navigate: ReturnType<typeof useNavigate>) => {
  navigate(`/editoras/${publisherId}`);
};

const BRAZILIAN_PUBLISHERS = [
  "Companhia das Letras",
  "Intrínseca",
  "Rocco",
  "Record",
  "Globo Livros",
  "Saraiva",
  "Objetiva",
  "Zahar",
  "L&PM",
  "Aleph",
];

const INDEPENDENT_PUBLISHERS = [
  "Editora 34",
  "Editora Nós",
  "Editora Urutau",
  "Editora Patuá",
  "Editora Moinhos",
  "Editora Quelônio",
  "Editora Kotter",
  "Editora Reformatório",
  "Editora Penalux",
  "Editora Malê"
];

const CHILDREN_PUBLISHERS = [
  "Editora Brinque-Book",
  "Editora Peirópolis",
  "Editora Callis",
  "Editora Salamandra",
  "Editora Panda Books",
  "Editora Carochinha",
  "Editora Girassol",
  "Editora Vale das Letras",
  "Editora Todolivro",
  "Editora Ciranda Cultural"
];

const INTERNATIONAL_PUBLISHERS = [
  "Penguin Random House",
  "HarperCollins",
  "Simon & Schuster",
  "Hachette Livre",
  "Macmillan Publishers",
  "Oxford University Press",
  "Cambridge University Press",
  "Scholastic Corporation",
  "Wiley",
  "Pearson Education"
];

const COMIC_PUBLISHERS = [
  "Panini Comics",
  "Mauricio de Sousa Produções",
  "Devir",
  "Pixel Media",
  "JBC",
  "DC Comics",
  "Marvel Comics",
  "Dark Horse Comics",
  "Image Comics",
  "Vertigo"
];

const ACADEMIC_PUBLISHERS = [
  "Editora da USP",
  "Editora Fiocruz",
  "Editora Unesp",
  "Editora UFMG",
  "Editora UnB",
  "Elsevier",
  "Springer Nature",
  "Sage Publications",
  "Taylor & Francis",
  "MIT Press"
];

const mapToPublisher = (name: string): Publisher => ({
  id: encodeURIComponent(name.toLowerCase().replace(/\s+/g, "-")),
  name,
});

const CATEGORY_LIST = [
  { id: "brazilian", name: "Editoras Brasileiras Populares", publishers: BRAZILIAN_PUBLISHERS.map(mapToPublisher) },
  { id: "international", name: "Editoras Internacionais", publishers: INTERNATIONAL_PUBLISHERS.map(mapToPublisher) },
  { id: "comics", name: "Editoras de Quadrinhos", publishers: COMIC_PUBLISHERS.map(mapToPublisher) },
  { id: "academic", name: "Editoras Acadêmicas", publishers: ACADEMIC_PUBLISHERS.map(mapToPublisher) },
  { id: "independent", name: "Editoras Independentes", publishers: INDEPENDENT_PUBLISHERS.map(mapToPublisher) },
  { id: "children", name: "Editoras Infantis", publishers: CHILDREN_PUBLISHERS.map(mapToPublisher) },
];

export const renderSearchResults = (searchQuery: string, publishers: Publisher[], isLoading: boolean) => (
  <div className="flex flex-col gap-4 w-full max-w-7xl px-4">
    <h2 className="text-xl font-bold">
      Resultados para: <span className="font-bold">{searchQuery}</span>
    </h2>
    {isLoading ? (
      <p className="text-gray-500">Carregando...</p>
    ) : publishers.length === 0 ? (
      <p className="text-gray-500">Nenhuma editora encontrada.</p>
    ) : (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {publishers.map((publisher) => (
          <PublisherCard
            key={publisher.id}
            publisher={publisher}
            onClick={() => handlePublisherClick(publisher.id, useNavigate())}
          />
        ))}
      </div>
    )}
  </div>
);

export const renderByCategoryResults = (publishersByCategory: PublisherCategory[], navigate: ReturnType<typeof useNavigate>) => (
  <div className="flex flex-col gap-6 w-full max-w-7xl px-4">
    {publishersByCategory.map((category) => (
      <div key={category.id} className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">{category.name}</h2>
        {category.publishers.length === 0 ? (
          <p className="text-gray-500">Nenhuma editora disponível nesta categoria.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {category.publishers.map((publisher) => (
              <PublisherCard
                key={publisher.id}
                publisher={publisher}
                onClick={() => handlePublisherClick(publisher.id, navigate)}
              />
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
);

export const PublisherListPage = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(search);
  const searchQuery = searchParams.get("search");

  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [publishersByCategory, setPublishersByCategory] = useState<PublisherCategory[]>(CATEGORY_LIST);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      setIsLoading(true);
      fetch(
        `https://openlibrary.org/search.json?publisher=${encodeURIComponent(
          searchQuery
        )}&limit=24&fields=publisher`
      )
        .then((res) => res.json())
        .then((data) => {
          const uniquePublishers = new Set<string>();
          const mapped = data.docs
            .flatMap((doc: any) => doc.publisher || [])
            .filter((name: string) => {
              if (!name || uniquePublishers.has(name)) return false;
              uniquePublishers.add(name);
              return true;
            })
            .map((name: string) => mapToPublisher(name));
          setPublishers(mapped);
        })
        .catch((error) => {
          console.error("Erro ao buscar editoras:", error);
        })
        .finally(() => setIsLoading(false));
    } else {
      // Use predefined Brazilian publishers
      setPublishersByCategory(CATEGORY_LIST);
    }
  }, [searchQuery]);

  return (
    <AppLayout hideSidebar>
      <div className="flex-1 flex justify-center py-6">
        {isLoading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : searchQuery ? (
          renderSearchResults(searchQuery, publishers, isLoading)
        ) : (
          renderByCategoryResults(publishersByCategory, navigate)
        )}
      </div>
    </AppLayout>
  );
};