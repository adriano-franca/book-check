import { AppLayout } from "@/components/layout/AppLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Publisher, PublisherCategory } from "@/@types/publishers";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
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

const mapToPublisher = (name: string): Publisher => ({
  id: encodeURIComponent(name.toLowerCase().replace(/\s+/g, "-")),
  name,
});

const CATEGORY_LIST = [
  { id: "brazilian", name: "Editoras Brasileiras Populares", publishers: BRAZILIAN_PUBLISHERS.map(mapToPublisher) },
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
      <div key={category.id}>
        <h2 className="text-xl font-bold mb-2">{category.name}</h2>
        <Carousel opts={{ loop: true, align: "start" }} className="w-full">
          <CarouselContent>
            {category.publishers.length === 0 ? (
              <CarouselItem>
                <p className="text-gray-500">Nenhuma editora disponível nesta categoria.</p>
              </CarouselItem>
            ) : (
              category.publishers.map((publisher) => (
                <CarouselItem
                  key={publisher.id}
                  className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
                >
                  <PublisherCard
                    publisher={publisher}
                    onClick={() => handlePublisherClick(publisher.id, navigate)}
                  />
                </CarouselItem>
              ))
            )}
          </CarouselContent>
          <CarouselPrevious className="ml-2" />
          <CarouselNext className="mr-2" />
        </Carousel>
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