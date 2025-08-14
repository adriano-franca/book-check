import api from '@/app/config/axios';

interface LivroResultado {
  id: string;
  titulo: string;
  autor: string;
}

interface AutorResultado {
  id: string;
  nome: string;
}

interface EditoraResultado {
  id: string;
  nome: string;
}

export interface SearchResult {
  livros: LivroResultado[];
  autores: AutorResultado[];
  editoras: EditoraResultado[];
}

/**
 * Realiza uma busca por livros, autores e editoras na sua API de backend.
 * @param query O termo que o usuário deseja buscar.
 * @returns Uma promessa que resolve para um objeto contendo as listas de resultados.
 */
export const searchOpenLibrary = async (query: string): Promise<SearchResult> => {
  try {
    const response = await api.get<SearchResult>('/search', {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar no backend:", error);
    return { livros: [], autores: [], editoras: [] };
  }
};
