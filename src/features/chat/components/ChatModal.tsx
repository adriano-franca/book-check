// src/features/chat/components/ChatModal.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useAuthStore } from '@/app/stores/authStore';
import { listarMensagens, enviarMensagem, type MensagemDTO, type UserSummaryDTO } from '../service/chatService';
import { toast } from 'sonner';

interface ChatModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  otherUser: UserSummaryDTO | null;
}

export const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onOpenChange, otherUser }) => {
  const { user: currentUser } = useAuthStore();
  const [messages, setMessages] = useState<MensagemDTO[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
        const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }, 100);
  };
  
  useEffect(() => {
    if (isOpen && currentUser && otherUser) {
      const fetchMessages = async () => {
        try {
          const history = await listarMensagens(currentUser.id, otherUser.id);
          setMessages(history);
          scrollToBottom();
        } catch (error) {
          toast.error("Erro ao carregar o histórico de mensagens.");
        }
      };
      fetchMessages();
    }
  }, [isOpen, currentUser, otherUser]);
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !otherUser) return;
    try {
      const sentMessage = await enviarMensagem({
        remetenteId: currentUser.id,
        destinatarioId: otherUser.id,
        conteudo: newMessage,
      });
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      toast.error("Falha ao enviar mensagem.");
    }
  };

  if (!otherUser) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] h-[600px] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
                <AvatarImage src={`https://i.pravatar.cc/150?u=${otherUser.id}`} />
                <AvatarFallback>{otherUser.nome.charAt(0)}</AvatarFallback>
            </Avatar>
            Conversa com {otherUser.nome}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-4 py-2" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${msg.remetente.id === currentUser?.id ? 'justify-end' : ''}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                    msg.remetente.id === currentUser?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {msg.conteudo}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="relative">
            <Input
              placeholder="Digite uma mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="pr-12"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8"
              onClick={handleSendMessage}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};