// src/features/chat/service/chatService.ts

import api from "@/app/config/axios";
import type { ConversaDTO, EnviarMensagemRequest, MensagemDTO, UserSummaryDTO } from "../@types/chat";

/**
 * Busca as conversas ativas para o usuário logado.
 * @param usuarioId O ID do usuário logado.
 * @returns Uma lista de conversas.
 */
export const listarConversas = async (usuarioId: number): Promise<ConversaDTO[]> => {
    const { data } = await api.get<ConversaDTO[]>('/chat/conversations', {
        params: { usuarioId },
    });
    return data;
};

/**
 * Busca o histórico de mensagens entre dois usuários.
 * @param currentUserId O ID do usuário logado.
 * @param userId O ID do outro usuário na conversa.
 * @returns Uma lista com as mensagens da conversa.
 */
export const listarMensagens = async (currentUserId: number, userId: number): Promise<MensagemDTO[]> => {
    const { data } = await api.get<MensagemDTO[]>('/chat/messages', {
        params: { currentUserId, userId },
    });
    return data;
};

/**
 * Envia uma nova mensagem para um usuário.
 * @param payload Objeto contendo os IDs do remetente, destinatário e o conteúdo da mensagem.
 * @returns A mensagem que foi criada e salva no backend.
 */
export const enviarMensagem = async (payload: EnviarMensagemRequest): Promise<MensagemDTO> => {
    const { data } = await api.post<MensagemDTO>('/chat/enviar', payload);
    return data;
};

// Reexportando os tipos para facilitar a importação em outros arquivos
export type { ConversaDTO, EnviarMensagemRequest, MensagemDTO, UserSummaryDTO };