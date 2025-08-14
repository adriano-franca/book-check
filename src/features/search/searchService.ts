import axios from 'axios';

interface OpenLibraryDoc {
  key: string;
  type: 'work' | 'author';
  title?: string;       
  name?: string;        
  author_name?: string[];
}

export const searchOpenLibrary = async (query: string) => {
  if (!query || query.trim().length < 2) {
    return { livros: [], autores: [] };
  }

  const encodedQuery = encodeURIComponent(query);
  const url = `https://openlibrary.org/search.json?q=${encodedQuery}&fields=key,type,title,name,author_name&limit=5`;

  try {
    const response = await axios.get<{ docs: OpenLibraryDoc[] }>(url);
    const docs = response.data.docs;

    const livros = docs
      .filter(doc => doc.type === 'work' && doc.title)
      .map(doc => ({
        id: doc.key,
        titulo: doc.title!,
        autor: doc.author_name ? doc.author_name.join(', ') : 'Desconhecido'
      }));

    const autores = docs
      .filter(doc => doc.type === 'author' && doc.name)
      .map(doc => ({
        id: doc.key,
        nome: doc.name!,
      }));

    return { livros, autores };

  } catch (error) {
    console.error("Erro ao buscar na Open Library API:", error);
    return { livros: [], autores: [] };
  }
};