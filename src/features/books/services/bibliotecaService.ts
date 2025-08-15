import api from "@/app/config/axios";
import type { Book } from "@/@types/books";

export const StatusLeitura = {
  NAO_INICIADO: "NAO_INICIADO",
  EM_ANDAMENTO: "EM_ANDAMENTO",
  ABANDONADO: "ABANDONADO",
  COMPLETO: "COMPLETO",
  RELENDO: "RELENDO",
} as const;

export type StatusLeitura = typeof StatusLeitura[keyof typeof StatusLeitura];

export const EstadoConservacao = {
  NOVO: "NOVO",
  BOM: "BOM",
  USADO: "USADO",
} as const;

export type EstadoConservacao = typeof EstadoConservacao[keyof typeof EstadoConservacao];

interface BibliotecaItemAPI {
  id: number;
  workId: string;
  statusLeitura: StatusLeitura;
  estadoConservacao: EstadoConservacao;
}

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

export const getBiblioteca = async (leitorId: number): Promise<BibliotecaBook[]> => {
  const { data: bibliotecaItems } = await api.get<BibliotecaItemAPI[]>(`/leitor/biblioteca/list/${leitorId}`);

  if (!bibliotecaItems || bibliotecaItems.length === 0) {
    return [];
  }

  const bookDetailPromises = bibliotecaItems.map(async (item) => {
    try {
      const res = await fetch(`https://openlibrary.org/works/${item.workId}.json`);
      const bookData = await res.json();
      
      const authorRes = await fetch(`https://openlibrary.org${bookData.authors?.[0]?.author?.key}.json`);
      const authorData = await authorRes.json();

      const completeBook: BibliotecaBook = {
        id: item.workId,
        bibliotecaId: item.id,
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