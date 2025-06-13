import { AppLayout } from "@/components/layout/AppLayout";
import { useLocation } from "react-router-dom";
import type { Author, AuthorCategory } from "@/@types/authors";
import {
  authors as dataAuthors,
  authorsByCategory as dataAuthorsByCategory,
} from "@/data/authors";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { AuthorCardVertical } from "../components/AuthorCardVertical";

export const handleAuthorClick = (authorId: string) => {
  window.location.href = `/livro/${authorId}`;
};

export const renderSearchResults = (searchQuery: string, authors: Author[]) => {
  return (
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
};

export const renderByCategoryResults = (
  authorsByCategory: AuthorCategory[]
) => {
  return (
    <div className="flex flex-col gap-2 w-[80%] max-w-[80%]">
      {authorsByCategory.map((category) => (
        <div key={category.id}>
          <h2 className="text-xl font-bold mb-2">{category.name}</h2>
          <Carousel
            opts={{
              loop: true,
            }}
          >
            <CarouselContent>
              {category.authors.map((author) => (
                <CarouselItem className="md:basis-1/2 lg:basis-1/6">
                  <AuthorCardVertical
                    key={author.id}
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
};

export const AuthorListPage = () => {
  const authors = dataAuthors;
  const authorsByCategory = dataAuthorsByCategory;
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const searchQuery = searchParams.get("search");

  return (
    <AppLayout hideSidebar>
      <div className="flex-1 flex justify-center">
        {searchQuery && renderSearchResults(searchQuery, authors)}
        {!searchQuery && renderByCategoryResults(authorsByCategory)}
      </div>
    </AppLayout>
  );
};
