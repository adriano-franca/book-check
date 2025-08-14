import api from '@/app/config/axios';

export interface Bookstore {
  id: string;
  name: string;
  rating: number;
  lat: number;
  lng: number;
  address: string;
  distance?: string;
}

/**
 * Busca livrarias próximas através da API do backend.
 * @param latitude Latitude do usuário.
 * @param longitude Longitude do usuário.
 * @returns Uma promessa que resolve para uma lista de livrarias.
 */
export const fetchNearbyBookstores = async (latitude: number, longitude: number): Promise<Bookstore[]> => {
  try {
    const response = await api.get<Bookstore[]>('/places/nearby', {
      params: {
        lat: latitude,
        lng: longitude,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar livrarias no backend:", error);
    throw error; // Propaga o erro para ser tratado no componente
  }
};
