import { AppLayout } from "@/components/layout/AppLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Author, AuthorCategory } from "@/@types/authors";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { AuthorCardVertical } from "../components/AuthorCardVertical";

export const handleAuthorClick = (authorId: string, navigate: ReturnType<typeof useNavigate>) => {
  navigate(`/author/${authorId}`);
};

const mapToAuthor = (doc: any, authorId?: string): Author => {
  const id = authorId || doc.key?.replace("/authors/", "") || crypto.randomUUID();
  const photoId = doc.photos?.[0];
  let coverImage = "/placeholder-author.jpg";

  if (photoId) {
    coverImage = `https://covers.openlibrary.org/a/id/${photoId}-M.jpg`;
  } else if (id) {
    coverImage = `https://covers.openlibrary.org/a/olid/${id}-M.jpg`;
  } else {
    console.warn(`Author ${doc.name || "unknown"} has no photo or valid ID, using placeholder`);
  }

  return {
    id,
    name: doc.name || doc.author_name?.[0] || "Desconhecido",
    coverImage,
  };
};

const CATEGORY_LIST = [
  { id: "romance", name: "Autores de Romance", query: "subject:romance" },
  { id: "science_fiction", name: "Autores de Ficção Científica", query: "subject:science_fiction" },
  { id: "nonfiction", name: "Autores de Não Ficção", query: "subject:nonfiction" },
  { id: "mystery", name: "Autores de Mistério", query: "subject:mystery" },
  { id: "classics", name: "Autores de Clássicos", query: "subject:classics" },
  { id: "fantasy", name: "Autores de Fantasia", query: "subject:fantasy" },
  { id: "biography", name: "Autores de Biografia", query: "subject:biography" },
  { id: "young_adult_fiction", name: "Autores de Jovem Adulto", query: "subject:young_adult_fiction" },
  { id: "horror", name: "Autores de Terror", query: "subject:horror" },
  { id: "historical_fiction", name: "Autores de Ficção Histórica", query: "subject:historical_fiction" },
];

export const renderSearchResults = (searchQuery: string, authors: Author[], isLoading: boolean) => (
  <div className="flex flex-col gap-4 w-full max-w-7xl px-4">
    <h2 className="text-xl font-bold">
      Resultados para: <span className="font-bold">{searchQuery}</span>
    </h2>
    {isLoading ? (
      <p className="text-gray-500">Carregando...</p>
    ) : authors.length === 0 ? (
      <p className="text-gray-500">Nenhum autor encontrado.</p>
    ) : (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {authors.map((author) => (
          <AuthorCardVertical
            key={author.id}
            author={author}
            onClick={() => handleAuthorClick(author.id, useNavigate())}
          />
        ))}
      </div>
    )}
  </div>
);

export const renderByCategoryResults = (authorsByCategory: AuthorCategory[], navigate: ReturnType<typeof useNavigate>) => (
  <div className="flex flex-col gap-6 w-full max-w-7xl px-4">
    {authorsByCategory.map((category) => (
      <div key={category.id}>
        <h2 className="text-xl font-bold mb-2">{category.name}</h2>
        <Carousel opts={{ loop: true, align: "start" }} className="w-full">
          <CarouselContent>
            {category.authors.length === 0 ? (
              <CarouselItem>
                <p className="text-gray-500">Nenhum autor disponível nesta categoria.</p>
              </CarouselItem>
            ) : (
              category.authors.map((author) => (
                <CarouselItem
                  key={author.id}
                  className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
                >
                  <AuthorCardVertical
                    author={author}
                    onClick={() => handleAuthorClick(author.id, navigate)}
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

export const AuthorListPage = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(search);
  const searchQuery = searchParams.get("search");

  const [authors, setAuthors] = useState<Author[]>([]);
  const [authorsByCategory, setAuthorsByCategory] = useState<AuthorCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      setIsLoading(true);
      fetch(
        `https://openlibrary.org/search/authors.json?q=${encodeURIComponent(
          searchQuery
        )}&limit=24&fields=key,name,photos`
      )
        .then((res) => res.json())
        .then((data) => {
          const mapped = data.docs.map(mapToAuthor);
          setAuthors(mapped);
        })
        .catch((error) => {
          console.error("Erro ao buscar autores:", error);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(true);
      Promise.all(
        CATEGORY_LIST.map(async (category) => {
          try {
            const res = await fetch(
              `https://openlibrary.org/search.json?q=${category.query}&limit=12&fields=author_key,author_name`
            );
            const data = await res.json();
            const uniqueAuthorsMap: Record<string, Author> = {};
            for (const work of data.docs) {
              const authors = work.author_key?.map((id: string, i: number) =>
                mapToAuthor({ author_name: [work.author_name?.[i]] }, id)
              ) || [];
              for (const a of authors) {
                if (a.id && !uniqueAuthorsMap[a.id]) {
                  uniqueAuthorsMap[a.id] = a;
                }
              }
            }
            return {
              id: category.id,
              name: category.name,
              authors: Object.values(uniqueAuthorsMap).slice(0, 12),
            } as AuthorCategory;
          } catch (error) {
            console.error(`Erro ao buscar categoria ${category.name}:`, error);
            return { id: category.id, name: category.name, authors: [] };
          }
        })
      )
        .then(setAuthorsByCategory)
        .finally(() => setIsLoading(false));
    }
  }, [searchQuery]);

  return (
    <AppLayout hideSidebar>
      <div className="flex-1 flex justify-center py-6">
        {isLoading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : searchQuery ? (
          renderSearchResults(searchQuery, authors, isLoading)
        ) : (
          renderByCategoryResults(authorsByCategory, navigate)
        )}
      </div>
    </AppLayout>
  );
};