export interface GutendexBook {
  id: number;
  title: string;
  authors: { name: string }[];
  formats: { [key: string]: string };
}

export const getBooksFromGutendex = async (page = 1): Promise<GutendexBook[]> => {
  const res = await fetch(`https://gutendex.com/books/?page=${page}`);
  const data = await res.json();
  return data.results;
};
