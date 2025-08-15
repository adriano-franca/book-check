export type UserSummary = {
  id: number;
  nome: string;
  email?: string;
  avatarUrl?: string | null;
  descricao?: string | null;
  unread?: number;
};

export type Message = {
  id: number;
  conteudo: string;
  dataEnvio: string; // ISO
  lida: boolean;
  remetente: UserSummary;
  destinatario: UserSummary;
};

export type Conversation = {
  user: UserSummary; // pessoa com quem estou conversando
  lastMessage?: Message | null;
};