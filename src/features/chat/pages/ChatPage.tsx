import React, { useEffect, useMemo, useRef, useState } from "react";
import { create } from "zustand";
import { produce } from "immer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Send, Circle, CheckCheck, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Chat Feature (frontend)
 * - Stack: React + Zustand store + shadcn/ui + Tailwind + framer-motion
 * - Realtime: STOMP over SockJS (optional; auto-connect if libs are installed & backend is up)
 * - Integrations expected (backend):
 *    GET  /api/chat/conversations                 -> lista de conversas/contatos
 *    GET  /api/chat/messages?userId=<destId>      -> histórico 1-1 (ordenado ASC)
 *    POST /api/chat/enviar                        -> envia mensagem { remetente, destinatario, conteudo }
 *   WS:  endpoint /chat-websocket (SockJS) | app destination /app/enviar | user topic /user/{id}/topic/mensagens
 *
 * Como usar:
 *  1) Instale deps: npm i zustand immer @stomp/stompjs sockjs-client framer-motion lucide-react
 *  2) Garanta que shadcn/ui esteja configurado (Input, Button, Card, etc.).
 *  3) Renderize <ChatPage currentUserId={idDoUsuarioLogado} apiBaseUrl={"http://localhost:8080"} /> dentro do seu AppLayout.
 */

// ============================
// Types
// ============================
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

// ============================
// API Client
// ============================
async function apiGET<T>(url: string, token?: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function apiPOST<T>(url: string, body: unknown, token?: string): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ============================
// Store (Zustand)
// ============================
interface ChatState {
  conversations: Conversation[];
  messagesByUserId: Record<string, Message[]>; // key = destinatarioId (com quem converso)
  selectedUserId: number | null;
  loadingConversations: boolean;
  loadingMessages: boolean;
  sending: boolean;
  filter: string;
  setFilter: (q: string) => void;
  setSelectedUser: (id: number | null) => void;
  setConversations: (list: Conversation[]) => void;
  prependOrUpdateConversation: (c: Conversation) => void;
  setMessages: (userId: number, list: Message[]) => void;
  appendMessage: (userId: number, msg: Message) => void;
  markRead: (userId: number) => void;
  setLoadingConversations: (v: boolean) => void;
  setLoadingMessages: (v: boolean) => void;
  setSending: (v: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  messagesByUserId: {},
  selectedUserId: null,
  loadingConversations: false,
  loadingMessages: false,
  sending: false,
  filter: "",
  setFilter: (q) => set({ filter: q }),
  setSelectedUser: (id) => set({ selectedUserId: id }),
  setConversations: (list) => set({ conversations: list }),
  prependOrUpdateConversation: (c) =>
    set(
      produce((draft: ChatState) => {
        const idx = draft.conversations.findIndex((x) => x.user.id === c.user.id);
        if (idx >= 0) {
          draft.conversations[idx] = { ...draft.conversations[idx], ...c };
          // Move para o topo
          const item = draft.conversations.splice(idx, 1)[0];
          draft.conversations.unshift(item);
        } else {
          draft.conversations.unshift(c);
        }
      })
    ),
  setMessages: (userId, list) =>
    set(
      produce((draft: ChatState) => {
        draft.messagesByUserId[String(userId)] = list;
      })
    ),
  appendMessage: (userId, msg) =>
    set(
      produce((draft: ChatState) => {
        const key = String(userId);
        if (!draft.messagesByUserId[key]) draft.messagesByUserId[key] = [];
        draft.messagesByUserId[key].push(msg);
      })
    ),
  markRead: (userId) =>
    set(
      produce((draft: ChatState) => {
        const conv = draft.conversations.find((c) => c.user.id === userId);
        if (conv?.user) conv.user.unread = 0;
      })
    ),
  setLoadingConversations: (v) => set({ loadingConversations: v }),
  setLoadingMessages: (v) => set({ loadingMessages: v }),
  setSending: (v) => set({ sending: v }),
}));

// ============================
// Hooks: data fetching
// ============================
function useChatApi(apiBaseUrl: string, token?: string) {
  const {
    setConversations,
    setLoadingConversations,
    setMessages,
    setLoadingMessages,
    prependOrUpdateConversation,
    appendMessage,
  } = useChatStore();

  const loadConversations = async () => {
    setLoadingConversations(true);
    try {
      const list = await apiGET<Conversation[]>(`${apiBaseUrl}/api/chat/conversations`, token);
      setConversations(list);
    } finally {
      setLoadingConversations(false);
    }
  };

  const loadMessages = async (otherUserId: number) => {
    setLoadingMessages(true);
    try {
      const list = await apiGET<Message[]>(`${apiBaseUrl}/api/chat/messages?userId=${otherUserId}`, token);
      setMessages(otherUserId, list);
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async (
    currentUser: number,
    otherUser: number,
    conteudo: string
  ) => {
    const payload = {
      remetente: { id: currentUser },
      destinatario: { id: otherUser },
      conteudo,
    };
    const saved = await apiPOST<Message>(`${apiBaseUrl}/api/chat/enviar`, payload, token);
    // Atualiza UI otimista
    appendMessage(otherUser, saved);
    prependOrUpdateConversation({ user: saved.destinatario.id === currentUser ? saved.remetente : saved.destinatario, lastMessage: saved });
    return saved;
  };

  const handleIncoming = (msg: Message, currentUserId: number) => {
    const other = msg.remetente.id === currentUserId ? msg.destinatario : msg.remetente;
    appendMessage(other.id, msg);
    prependOrUpdateConversation({ user: other, lastMessage: msg });
  };

  return { loadConversations, loadMessages, sendMessage, handleIncoming };
}

// ============================
// Realtime (STOMP)
// ============================
function useStompRealtime(enabled: boolean, currentUserId: number | null, onMessage: (m: Message) => void, apiBaseUrl: string) {
  const clientRef = useRef<any>(null);

  useEffect(() => {
    if (!enabled || !currentUserId) return;

    let active = true;
    (async () => {
      try {
        const { Client } = await import("@stomp/stompjs");
        const SockJS = (await import("sockjs-client")).default;

        const client = new Client({
          webSocketFactory: () => new SockJS(`${apiBaseUrl}/chat-websocket`),
          reconnectDelay: 5000,
          heartbeatIncoming: 10000,
          heartbeatOutgoing: 10000,
          onConnect: () => {
            client.subscribe(`/user/${currentUserId}/topic/mensagens`, (frame: any) => {
              try {
                const m: Message = JSON.parse(frame.body);
                onMessage(m);
              } catch {}
            });
          },
        });
        clientRef.current = client;
        if (active) client.activate();
      } catch (e) {
        console.warn("STOMP/SockJS libs missing or failed:", e);
      }
    })();

    return () => {
      active = false;
      if (clientRef.current) clientRef.current.deactivate();
    };
  }, [enabled, currentUserId, apiBaseUrl, onMessage]);
}

// ============================
// UI Components
// ============================

const UserAvatar = ({ user, size = "8" }: { user: UserSummary; size?: string }) => {
  const initials = (user.nome || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
    
  return (
    <div className={`relative`}>
      <Avatar className={`h-${size} w-${size}`}>
        {user.avatarUrl ? (
          <AvatarImage src={user.avatarUrl} alt={user.nome} />
        ) : (
          <AvatarFallback>{initials}</AvatarFallback>
        )}
      </Avatar>
      {!!user.unread && user.unread > 0 && (
        <Badge className="absolute -top-1 -right-1 px-1 py-0 text-[10px]" variant="destructive">
          {user.unread}
        </Badge>
      )}
    </div>
  );
}

const ConversationItem = ({ conv, selected, onClick }: { conv: Conversation; selected?: boolean; onClick?: () => void }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-2xl transition shadow-sm border flex gap-3 items-center hover:bg-accent ${
        selected ? "bg-accent" : "bg-background"
      }`}
    >
      <UserAvatar user={conv.user} />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-medium line-clamp-1">{conv.user.nome}</span>
          {conv.lastMessage && (
            <span className="text-xs text-muted-foreground">
              {new Date(conv.lastMessage.dataEnvio).toLocaleTimeString()}
            </span>
          )}
        </div>
        <div className="text-sm text-muted-foreground line-clamp-1">
          {conv.lastMessage ? conv.lastMessage.conteudo : conv.user.descricao || ""}
        </div>
      </div>
    </button>
  );
}

function MessageBubble({ m, isMine }: { m: Message; isMine: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`max-w-[75%] rounded-2xl px-3 py-2 shadow-sm border ${
        isMine ? "bg-primary text-primary-foreground ml-auto" : "bg-card"
      }`}
    >
      <div className="whitespace-pre-wrap break-words text-sm">{m.conteudo}</div>
      <div className={`mt-1 flex items-center gap-1 text-[10px] ${isMine ? "opacity-80" : "text-muted-foreground"}`}>
        <span>{new Date(m.dataEnvio).toLocaleTimeString()}</span>
        {isMine && (m.lida ? <CheckCheck size={12} /> : <Circle size={10} />)}
      </div>
    </motion.div>
  );
}

function MessagesPane({
  otherUser,
  currentUserId,
  apiBaseUrl,
}: {
  otherUser: UserSummary | null;
  currentUserId: number;
  apiBaseUrl: string;
}) {
  const { selectedUserId, loadingMessages, sending } = useChatStore();
  const { loadMessages, sendMessage } = useChatApi(apiBaseUrl);
  const messages = useChatStore((s) => (selectedUserId ? s.messagesByUserId[String(selectedUserId)] : [])) || [];
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [text, setText] = useState("");

  useEffect(() => {
    if (selectedUserId) loadMessages(selectedUserId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const onSend = async () => {
    const content = text.trim();
    if (!content || !selectedUserId) return;
    setText("");
    try {
      await sendMessage(currentUserId, selectedUserId, content);
    } catch (e) {
      console.error(e);
    }
  };

  if (!otherUser) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">Selecione uma conversa</div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 border-b">
        <UserAvatar user={otherUser} size="9" />
        <div>
          <div className="font-semibold">{otherUser.nome}</div>
          <div className="text-xs text-muted-foreground">{otherUser.email}</div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-2">
          {loadingMessages ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-2/3 ml-auto" />
              <Skeleton className="h-6 w-1/3" />
            </div>
          ) : (
            messages.map((m) => (
              <MessageBubble key={m.id} m={m} isMine={m.remetente.id === currentUserId} />
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <div className="p-3 border-t flex items-center gap-2">
        <Input
          placeholder={`Mensagem para ${otherUser.nome}`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
        />
        <Button disabled={sending || text.trim().length === 0} onClick={onSend} className="rounded-2xl">
          {sending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
        </Button>
      </div>
    </div>
  );
}

// ============================
// Page
// ============================
export default function ChatPage({ currentUserId, apiBaseUrl, token, enableRealtime = true }: { currentUserId: number; apiBaseUrl: string; token?: string; enableRealtime?: boolean; }) {
  const { conversations, loadingConversations, filter, setFilter, selectedUserId, setSelectedUser } = useChatStore();
  const { loadConversations, handleIncoming } = useChatApi(apiBaseUrl, token);

  useEffect(() => {
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Realtime subscription
  useStompRealtime(enableRealtime, currentUserId, (m) => handleIncoming(m, currentUserId), apiBaseUrl);

  const filtered = useMemo(
    () =>
      conversations.filter((c) =>
        (c.user.nome || "").toLowerCase().includes(filter.toLowerCase()) ||
        (c.user.email || "").toLowerCase().includes(filter.toLowerCase())
      ),
    [conversations, filter]
  );

  const selected = conversations.find((c) => c.user.id === selectedUserId) || null;

  return (
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-8rem)]">{/* ajuste de altura conforme seu layout */}
      {/* Left: conversations list */}
      <Card className="col-span-4 flex flex-col rounded-2xl overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2"><Search size={18} /> Conversas</CardTitle>
          <div className="mt-2">
            <Input placeholder="Buscar pessoas..." value={filter} onChange={(e) => setFilter(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1">
          <ScrollArea className="h-full p-2">
            <div className="space-y-2">
              {loadingConversations && (
                <div className="space-y-2 p-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              )}
              {filtered.map((conv) => (
                <ConversationItem
                  key={conv.user.id}
                  conv={conv}
                  selected={selectedUserId === conv.user.id}
                  onClick={() => setSelectedUser(conv.user.id)}
                />
              ))}
              {!loadingConversations && filtered.length === 0 && (
                <div className="text-center text-sm text-muted-foreground p-4">Nenhuma conversa encontrada</div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Right: messages */}
      <Card className="col-span-8 rounded-2xl overflow-hidden">
        <MessagesPane otherUser={selected?.user || null} currentUserId={currentUserId} apiBaseUrl={apiBaseUrl} />
      </Card>
    </div>
  );
}