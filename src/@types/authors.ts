export interface Author {
  id: string;
  name: string;
  coverImage: string;
}

export interface AuthorCategory {
  id: string;
  name: string;
  authors: Author[];
}