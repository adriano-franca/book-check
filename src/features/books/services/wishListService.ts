import api from "@/app/config/axios";
import type { Book } from "@/@types/books";

interface WishlistItemAPI {
  id: number;
  workId: string;
}

export interface WishlistBook extends Book {
  wishlistId: number;
}

interface AddToWishlistPayload {
  leitorId: number;
  workId: string;
}

/**
 * Busca a lista de desejos e enriquece com os detalhes da Open Library.
 */
export const getWishlist = async (leitorId: number): Promise<WishlistBook[]> => {
  const { data: wishlistItems } = await api.get<WishlistItemAPI[]>(`/leitor/livroDesejado/list/${leitorId}`);

  if (!wishlistItems || wishlistItems.length === 0) {
    return [];
  }

  const bookDetailPromises = wishlistItems.map(async (item) => {
    try {
      const res = await fetch(`https://openlibrary.org/works/${item.workId}.json`);
      const bookData = await res.json();
      const authorRes = await fetch(`https://openlibrary.org${bookData.authors?.[0]?.author?.key}.json`);
      const authorData = await authorRes.json();

      const completeBook: WishlistBook = {
        id: item.workId,
        wishlistId: item.id,
        title: bookData.title,
        author: authorData.name ?? "Autor desconhecido",
        coverImage: bookData.covers?.[0] ? `https://covers.openlibrary.org/b/id/${bookData.covers[0]}-L.jpg` : "https://placehold.co/128x192?text=Sem+Capa",
        description: typeof bookData.description === 'string' ? bookData.description : bookData.description?.value ?? "Sem descrição.",
      };
      return completeBook;
    } catch (error) {
      console.error(`Falha ao buscar detalhes para o livro ${item.workId}`, error);
      return null;
    }
  });

  return (await Promise.all(bookDetailPromises)).filter(book => book !== null) as WishlistBook[];
};

/**
 * Adiciona um livro à lista de desejos.
 */
export const addToWishlist = async (payload: AddToWishlistPayload) => {
  const { data } = await api.post('/leitor/livroDesejado', payload);
  return data;
};

/**
 * Remove um livro da lista de desejos.
 */
export const removeFromWishlist = async (wishlistId: number) => {
  await api.delete(`/leitor/livroDesejado/${wishlistId}`);
};