import { AppLayout } from "@/components/layout/AppLayout";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Author, AuthorCategory } from "@/@types/authors";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { AuthorCardVertical } from "../components/AuthorCardVertical";

export const handleAuthorClick = (authorId: string) => {
  window.location.href = `/autor/${authorId}`;
};

const mapToAuthor = (doc: any): Author => ({
  id: doc.key?.replace("/authors/", "") ?? crypto.randomUUID(),
  name: doc.name ?? "Sem nome",
  coverImage: doc.photos?.[0]
    ? `https://covers.openlibrary.org/a/id/${doc.photos[0]}-M.jpg`
    : "https://placehold.co/600x400?text=Sem+Foto"
});

const CATEGORY_LIST = [
  { id: "romance", name: "Autores de Romance", query: "subject:romance" },
  { id: "fiction", name: "Autores de Ficção", query: "subject:fiction" },
  { id: "philosophy", name: "Autores de Filosofia", query: "subject:philosophy" },
];

export const renderSearchResults = (searchQuery: string, authors: Author[]) => (
  <div className="flex flex-col gap-2 w-[80%] max-w-[80%]">
    <h2>
      Resultados para: <span className="font-bold">{searchQuery}</span>
    </h2>
    <div className="grid grid-cols-7 gap-2">
      {authors.map((author) => (
        <AuthorCardVertical
          key={author.id}
          author={author}
          onClick={() => handleAuthorClick(author.id)}
        />
      ))}
    </div>
  </div>
);

export const renderByCategoryResults = (authorsByCategory: AuthorCategory[]) => (
  <div className="flex flex-col gap-2 w-[80%] max-w-[80%]">
    {authorsByCategory.map((category) => (
      <div key={category.id}>
        <h2 className="text-xl font-bold mb-2">{category.name}</h2>
        <Carousel opts={{ loop: true }}>
          <CarouselContent>
            {category.authors.map((author) => (
              <CarouselItem key={author.id} className="md:basis-1/2 lg:basis-1/6">
                <AuthorCardVertical
                  author={author}
                  onClick={() => handleAuthorClick(author.id)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    ))}
  </div>
);

export const AuthorListPage = () => {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const searchQuery = searchParams.get("search");

  const [authors, setAuthors] = useState<Author[]>([]);
  const [authorsByCategory, setAuthorsByCategory] = useState<AuthorCategory[]>([]);

  useEffect(() => {
    if (searchQuery) {
      fetch(`https://openlibrary.org/search/authors.json?q=${encodeURIComponent(searchQuery)}&limit=21`)
        .then((res) => res.json())
        .then((data) => {
          const mapped = data.docs.map(mapToAuthor);
          setAuthors(mapped);
        });
    } else {
      // Pré-carregamento por categoria
      Promise.all(
        CATEGORY_LIST.map(async (category) => {
          const res = await fetch(`https://openlibrary.org/search.json?q=${category.query}&limit=10`);
          const data = await res.json();
          // Pega autores únicos dos resultados dos livros
          const uniqueAuthorsMap: Record<string, Author> = {};
          for (const work of data.docs) {
            const authors = work.author_key?.map((id: string, i: number) => ({
              id,
              name: work.author_name?.[i],
            })) || [];

            for (const a of authors) {
              if (a.id && !uniqueAuthorsMap[a.id]) {
                uniqueAuthorsMap[a.id] = {
                  id: a.id,
                  name: a.name ?? "Desconhecido",
                  coverImage: `https://covers.openlibrary.org/a/olid/${a.id}-M.jpg`,
                };
              }
            }
          }

          return {
            id: category.id,
            name: category.name,
            authors: Object.values(uniqueAuthorsMap).slice(0, 10),
          } as AuthorCategory;
        })
      ).then(setAuthorsByCategory);
    }
  }, [searchQuery]);

  return (
    <AppLayout hideSidebar>
      <div className="flex-1 flex justify-center">
        {searchQuery
          ? renderSearchResults(searchQuery, authors)
          : renderByCategoryResults(authorsByCategory)}
      </div>
    </AppLayout>
  );
};
