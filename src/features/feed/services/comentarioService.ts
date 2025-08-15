import api from "@/app/config/axios";

interface NewCommentPayload {
  texto: string;
  publicacaoId: number;
}

export const createComment = async (payload: NewCommentPayload) => {
  const response = await api.post("/usuario/publicacao/comentario", payload);
  return response.data;
};