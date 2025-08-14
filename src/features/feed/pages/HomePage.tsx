import { AppLayout } from "@/components/layout/AppLayout";
import { PostCard } from "../components/PostCard";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/stores/authStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AxiosError } from "axios";
import api from "@/app/config/axios.ts";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Post {
  id: number;
  texto: string;
  autor: {
    nome: string;
    id: number;
  };
  avatarImage?: string;
  curtidas?: { autor: { id: number } }[];
}

export const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostText, setNewPostText] = useState("");
  const [posting, setPosting] = useState(false);

  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const response = await api.get("/usuario/publicacao/list");
      if (!Array.isArray(response.data)) {
        throw new Error("Formato inválido");
      }
      setPosts(response.data);
    } catch (error) {
      const err = error as AxiosError;
      if (err.response?.status === 401) {
        toast.error("Sessão expirada. Faça login novamente.");
        navigate("/login", { replace: true });
      } else {
        toast.error("Erro ao carregar publicações.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !token) {
      navigate("/login", { replace: true });
      return;
    }
    fetchPosts();
  }, [isAuthenticated, token, navigate]);

  const handleSubmitPost = async () => {
    if (!newPostText.trim()) {
      toast.error("A publicação não pode estar vazia.");
      return;
    }

    try {
      setPosting(true);
      const now = new Date();
      const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

      await api.post("/usuario/publicacao", {
        texto: newPostText,
        dataHora: formattedDate,
      });

      toast.success("Post publicado com sucesso!");
      setNewPostText("");
      await fetchPosts();
    } catch (error) {
      toast.error("Erro ao publicar post.");
      console.error(error);
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Carregando publicações...</p>
        </div>
      </AppLayout>
    );
  }

  return (
      <AppLayout>
        {/* Formulário de novo post */}
        <div className="space-y-4 pb-6 border-b border-border mb-6">
          <Textarea
              placeholder="No que você está pensando?"
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              rows={4}
          />
          <div className="flex justify-end">
            <Button onClick={handleSubmitPost} disabled={posting}>
              {posting ? "Publicando..." : "Publicar"}
            </Button>
          </div>
        </div>

      <div className="space-y-6 mt-6">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={`post-${post.id}`} post={post} />)
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <p className="text-muted-foreground text-lg">
              Nenhuma publicação encontrada
            </p>
            <p className="text-sm text-muted-foreground/70">
              Seja o primeiro a compartilhar algo!
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};