import api from "@/app/config/axios";

export const toggleLikePost = async (postId: number) => {
  const response = await api.post(`/publicacao/${postId}/curtir`);
  return response.data;
};