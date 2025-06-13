import { AppLayout } from "@/components/layout/AppLayout";
import { useLocation } from "react-router-dom";
import type { Publisher, PublisherCategory } from "@/@types/publisher";
import {
  publishers as dataPublishers,
  publisherByCategory as dataPublishersByCategory,
} from "@/data/publishers";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { PublisherCardVertical } from "../components/PublisherCardVertical";

export const handlePublisherClick = (publisherId: string) => {
  window.location.href = `/livro/${publisherId}`;
};

export const renderSearchResults = (searchQuery: string, publisher: Publisher[]) => {
  return (
    <div className="flex flex-col gap-2 w-[80%] max-w-[80%]">
      <h2>
        Resultados para: <span className="font-bold">{searchQuery}</span>
      </h2>
      <div className="grid grid-cols-7 gap-2">
        {publisher.map((publisher) => (
          <PublisherCardVertical
            key={publisher.id}
            publisher={publisher}
            onClick={() => handlePublisherClick(publisher.id)}
          />
        ))}
      </div>
    </div>
  );
};

export const renderByCategoryResults = (
  publisherByCategory: PublisherCategory[]
) => {
  return (
    <div className="flex flex-col gap-2 w-[80%] max-w-[80%]">
      {publisherByCategory.map((category) => (
        <div key={category.id}>
          <h2 className="text-xl font-bold mb-2">{category.name}</h2>
          <Carousel
            opts={{
              loop: true,
            }}
          >
            <CarouselContent>
              {category.publishers.map((publisher) => (
                <CarouselItem className="md:basis-1/2 lg:basis-1/6">
                  <PublisherCardVertical
                    key={publisher.id}
                    publisher={publisher}
                    onClick={() => handlePublisherClick(publisher.id)}
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

export const PublisherListPage = () => {
  const publisher = dataPublishers;
  const publisherByCategory = dataPublishersByCategory;
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const searchQuery = searchParams.get("search");

  return (
    <AppLayout hideSidebar>
      <div className="flex-1 flex justify-center">
        {searchQuery && renderSearchResults(searchQuery, publisher)}
        {!searchQuery && renderByCategoryResults(publisherByCategory)}
      </div>
    </AppLayout>
  );
};
