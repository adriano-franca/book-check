export interface UserSummaryDTO {
  id: number;
  nome: string;
  email: string;
  avatarUrl?: string; 
  descricao?: string;
  unread?: number;
}

export interface MensagemDTO {
  id: number;
  conteudo: string;
  dataEnvio: string; 
  lida: boolean;
  remetente: UserSummaryDTO;
  destinatario: UserSummaryDTO;
}

export interface ConversaDTO {
  user: UserSummaryDTO;
  lastMessage: MensagemDTO;
}

export interface EnviarMensagemRequest {
    remetenteId: number;
    destinatarioId: number;
    conteudo: string;
}