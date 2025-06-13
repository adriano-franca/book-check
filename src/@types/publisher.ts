export interface Publisher {
  id: string;
  name: string;
  coverImage: string;
}

export interface PublisherCategory {
  id: string;
  name: string;
  publishers: Publisher[];
}