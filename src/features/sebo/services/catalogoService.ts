import api from "@/app/config/axios";
import type { Book } from "@/@types/books";

// Enums que espelham o backend
export const EstadoConservacao = {
  NOVO: "NOVO",
  SEMI_NOVO: "SEMI_NOVO",
  BOM: "BOM",
  USADO: "USADO",
  GASTO: "GASTO",
  DANIFICADO: "DANIFICADO",
  RESTAURADO: "RESTAURADO",
  RARO: "RARO",
} as const;
export type EstadoConservacao = typeof EstadoConservacao[keyof typeof EstadoConservacao];

export const DisponibilidadeCatalogo = {
  DISPONIVEL: "DISPONIVEL",
  INDISPONIVEL: "INDISPONIVEL",
} as const;
export type DisponibilidadeCatalogo = typeof DisponibilidadeCatalogo[keyof typeof DisponibilidadeCatalogo];

// Interface para um item cru que vem da sua API /catalogo/list/{seboId}
interface CatalogoItemAPI {
  id: number; // ID do registro na tabela catalogo
  workId: string;
  estadoConservacao: EstadoConservacao;
  preco: number;
  quantidade: number;
  status: DisponibilidadeCatalogo;
}

// Interface para o livro completo no catálogo
export interface CatalogoBook extends Book {
  catalogoId: number;
  estadoConservacao: EstadoConservacao;
  preco: number;
  quantidade: number;
  status: DisponibilidadeCatalogo;
}

// Payload para ADICIONAR um novo item ao catálogo
export interface AddToCatalogoPayload {
  seboId: number;
  workId: string;
  estadoConservacao: EstadoConservacao;
  preco: number;
  quantidade: number;
  status: DisponibilidadeCatalogo;
}

// Payload para ATUALIZAR um item
export interface UpdateCatalogoPayload {
  estadoConservacao: EstadoConservacao;
  preco: number;
  quantidade: number;
  status: DisponibilidadeCatalogo;
}

/**
 * Adiciona um livro ao catálogo de um sebo.
 */
export const addToCatalogo = async (payload: AddToCatalogoPayload) => {
  const { data } = await api.post('/catalogo/sebo', payload);
  return data;
};

/**
 * Busca os livros do catálogo do sebo e enriquece com os detalhes da Open Library.
 */
export const getCatalogo = async (seboId: number): Promise<CatalogoBook[]> => {
  const { data: catalogoItems } = await api.get<CatalogoItemAPI[]>(`/catalogo/list/${seboId}`);

  if (!catalogoItems || catalogoItems.length === 0) {
    return [];
  }

  const bookDetailPromises = catalogoItems.map(async (item) => {
    try {
      const res = await fetch(`https://openlibrary.org/works/${item.workId}.json`);
      const bookData = await res.json();
      
      const authorRes = await fetch(`https://openlibrary.org${bookData.authors?.[0]?.author?.key}.json`);
      const authorData = await authorRes.json();

      const completeBook: CatalogoBook = {
        id: item.workId,
        catalogoId: item.id,
        title: bookData.title,
        author: authorData.name ?? "Autor desconhecido",
        coverImage: bookData.covers?.[0] ? `https://covers.openlibrary.org/b/id/${bookData.covers[0]}-L.jpg` : "https://placehold.co/128x192?text=Sem+Capa",
        description: typeof bookData.description === 'string' ? bookData.description : bookData.description?.value ?? "Sem descrição.",
        preco: item.preco,
        quantidade: item.quantidade,
        estadoConservacao: item.estadoConservacao,
        status: item.status,
      };
      return completeBook;
    } catch (error) {
      console.error(`Falha ao buscar detalhes para o livro ${item.workId}`, error);
      return null;
    }
  });

  return (await Promise.all(bookDetailPromises)).filter(book => book !== null) as CatalogoBook[];
};

/**
 * Atualiza um livro no catálogo de um sebo.
 */
export const updateCatalogo = async (catalogoId: number, payload: UpdateCatalogoPayload) => {
  const { data } = await api.put(`/catalogo/${catalogoId}`, payload);
  return data;
};

/**
 * Remove um livro do catálogo de um sebo.
 */
export const removeCatalogo = async (catalogoId: number) => {
  await api.delete(`/catalogo/${catalogoId}`);
};