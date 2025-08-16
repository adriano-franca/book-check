import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppLayout } from "@/components/layout/AppLayout";
import { PostCard } from "@/features/feed/components/PostCard";
import api from "@/app/config/axios";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChatModal } from "@/features/chat/components/ChatModal";
import { useAuthStore } from "@/app/stores/authStore";
import type { ProfileUser } from "../@types";

export const UserDetailPage = () => {
  const { userId } = useParams<{ userId: string }>();
  
  const [isChatModalOpen, setChatModalOpen] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null); 

  const { user: currentUser } = useAuthStore();

  const fetchProfileData = async () => {
    if (!userId) return;
    try {
      const { data } = await api.get(`/usuario/perfil-leitor/${userId}`);
      setProfileUser(data);
    } catch (error) {
      console.log("Não é leitor, tentando como sebo...");
      try {
        const { data } = await api.get(`/usuario/perfil-sebo/${userId}`);
        setProfileUser(data);
      } catch (finalError) {
        toast.error("Erro ao carregar perfil do usuário.");
      }
    }
  };

  const fetchPosts = async () => {
    if (!userId) return;
    try {
      const { data } = await api.get(`/usuario/publicacao/usuario/${userId}`);
      setPosts(Array.isArray(data?.content) ? data.content : []);
    } catch (e) {
        console.log("Usuário não possui publicações.");
    }
  };
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchProfileData();
      await fetchPosts();
      setLoading(false);
    }
    loadData();
  }, [userId]);

  const isMyProfile = currentUser?.id === Number(userId);

  return (
    <AppLayout>
      <div className="p-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <Avatar className="w-32 h-32">
              <AvatarImage src={`https://i.pravatar.cc/150?u=${profileUser?.id}`} />
              <AvatarFallback>{profileUser?.nome?.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{profileUser?.nome}</h1>
              <p className="text-muted-foreground">
                {profileUser?.descricao ?? "Sem descrição"}
              </p>
            </div>
          </div>
          
          {!isMyProfile && profileUser && (
            <Button onClick={() => setChatModalOpen(true)}>
              Enviar Mensagem
            </Button>
          )}
        </div>

        <div className="mt-12">
            <h2 className="text-lg font-bold mb-4">Publicações</h2>
            {loading ? (
                <p>Carregando publicações...</p>
            ) : posts.length > 0 ? (
                posts.map((post: any) => (
                <PostCard key={`post-${post.id}`} post={post} />
                ))
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[300px]">
                <p className="text-muted-foreground text-lg">
                    Nenhuma publicação encontrada
                </p>
                </div>
            )}
        </div>
      </div>

      {profileUser && (
          <ChatModal 
            isOpen={isChatModalOpen}
            onOpenChange={setChatModalOpen}
            otherUser={profileUser}
          />
      )}
    </AppLayout>
  );
};