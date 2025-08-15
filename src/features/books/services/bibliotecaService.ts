import api from "@/app/config/axios";
import type { Book } from "@/@types/books";

// Objeto para Status de Leitura
export const StatusLeitura = {
  NAO_INICIADO: "NAO_INICIADO",
  EM_ANDAMENTO: "EM_ANDAMENTO",
  PAUSADO: "PAUSADO",
  ABANDONADO: "ABANDONADO",
  COMPLETO: "COMPLETO",
  RELENDO: "RELENDO",
} as const;

export type StatusLeitura = typeof StatusLeitura[keyof typeof StatusLeitura];

// Objeto para Estado de Conservação
export const EstadoConservacao = {
  NOVO: "NOVO",
  BOM: "BOM",
  USADO: "USADO",
} as const;

export type EstadoConservacao = typeof EstadoConservacao[keyof typeof EstadoConservacao];

// Interface para os dados crus que vêm da sua API /biblioteca/list/{id}
interface BibliotecaItemAPI {
  id: number; // Este é o bibliotecaId
  workId: string;
  statusLeitura: StatusLeitura;
  estadoConservacao: EstadoConservacao;
}

// Interface UNIFICADA: Representa o livro completo na estante
export interface BibliotecaBook extends Book {
  bibliotecaId: number;
  statusLeitura: StatusLeitura;
  estadoConservacao: EstadoConservacao;
}

interface AddToBibliotecaPayload {
  leitorId: number;
  workId: string;
  statusLeitura: StatusLeitura;
  estadoConservacao: EstadoConservacao;
}

interface UpdateBibliotecaPayload {
  statusLeitura: StatusLeitura;
  estadoConservacao: EstadoConservacao;
}

export const addToBiblioteca = async (payload: AddToBibliotecaPayload): Promise<any> => {
  const { data } = await api.post("/leitor/biblioteca", payload);
  return data;
};

export const updateInBiblioteca = async (bibliotecaId: number, payload: UpdateBibliotecaPayload): Promise<any> => {
  const { data } = await api.put(`/leitor/biblioteca/${bibliotecaId}`, payload);
  return data.biblioteca;
};

/**
 * Busca os livros da estante do usuário e enriquece com os detalhes da Open Library.
 */
export const getBiblioteca = async (leitorId: number): Promise<BibliotecaBook[]> => {
  // 1. Busca a lista de livros da sua estante (backend)
  const { data: bibliotecaItems } = await api.get<BibliotecaItemAPI[]>(`/leitor/biblioteca/list/${leitorId}`);

  if (!bibliotecaItems || bibliotecaItems.length === 0) {
    return [];
  }

  // 2. Cria uma lista de promessas para buscar os detalhes de cada livro
  const bookDetailPromises = bibliotecaItems.map(async (item) => {
    try {
      const res = await fetch(`https://openlibrary.org/works/${item.workId}.json`);
      const bookData = await res.json();
      
      const authorRes = await fetch(`https://openlibrary.org${bookData.authors?.[0]?.author?.key}.json`);
      const authorData = await authorRes.json();

      // Monta o objeto completo
      const completeBook: BibliotecaBook = {
        id: item.workId, // O ID do livro é o workId
        bibliotecaId: item.id, // O ID do registro na biblioteca
        title: bookData.title,
        author: authorData.name ?? "Autor desconhecido",
        coverImage: bookData.covers?.[0] ? `https://covers.openlibrary.org/b/id/${bookData.covers[0]}-L.jpg` : "https://placehold.co/128x192?text=Sem+Capa",
        description: typeof bookData.description === 'string' ? bookData.description : bookData.description?.value ?? "Sem descrição.",
        statusLeitura: item.statusLeitura,
        estadoConservacao: item.estadoConservacao,
      };
      return completeBook;
    } catch (error) {
      console.error(`Falha ao buscar detalhes para o livro ${item.workId}`, error);
      return null;
    }
  });

  const enrichedBooks = (await Promise.all(bookDetailPromises)).filter(book => book !== null) as BibliotecaBook[];
  
  return enrichedBooks;
};