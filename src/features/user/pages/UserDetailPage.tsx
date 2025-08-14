import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppLayout } from "@/components/layout/AppLayout";
import { PostCard } from "@/features/feed/components/PostCard";
import { use, useEffect, useState } from "react";
import api from "@/app/config/axios";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

export const UserDetailPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  const hasError = (error: unknown) => {
    const err = error as AxiosError;
    if (err.response?.status === 401) {
      toast.error("Sessão expirada. Faça login novamente.");
      navigate("/login", { replace: true });
    } else {
      toast.error("Erro ao carregar dados.");
    }
  };

  /*const getUser = async () => {
    try {
      const { data } = await api.get(`/usuario/perfil-sebo/${userId}`);
      setUser(data);
    } catch (error) {
      hasError(error);
    }
  };*/

  const fetchPosts = async () => {
    try {
      const { data } = await api.get(`/usuario/publicacao/usuario/${userId}`);
      setPosts(Array.isArray(data?.content) ? data.content : []);
      setUser(data?.content?.[0]?.autor ?? null);
    } catch (error) {
      hasError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // getUser();
    fetchPosts();
  }, []);

  return (
    <AppLayout>
      <div className="p-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <Avatar className="w-32 h-32">
              <AvatarImage src={"https://i.pravatar.cc/150?u=${post.autor?.id}"} />
              <AvatarFallback>LF</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{user?.nome}</h1>
              <p className="text-muted-foreground">
                {user?.descricao ?? "Sem descrição"}
              </p>
            </div>
          </div>
          {/*<Button className="bg-sky-400 hover:bg-sky-500 text-black font-semibold">
            Seguir
          </Button>*/}
        </div>

        <div className="mt-12">
          <h2 className="text-lg font-bold mb-4">Publicações</h2>
          {posts.length > 0 ? (
            posts.map((post) => (
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
    </AppLayout>
  );
};
