// @/pages/HomePage.tsx
import { AppLayout } from "@/components/layout/AppLayout";
import { PostCard } from "../components/PostCard";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/stores/authStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AxiosError } from "axios";
import api from "@/app/config/axios.ts";

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  // Add additional fields as needed from your API
}

export const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      if (!isAuthenticated || !token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        setLoading(true);
        console.log(api)
        const response = await api.get("/usuario/publicacao/list/all");

        // Validate response structure
        if (!Array.isArray(response.data)) {
          throw new Error("Invalid response format");
        }

        setPosts(response.data);
      } catch (error) {
        const err = error as AxiosError;
        console.error("Failed to fetch posts:", err);

        if (err.response?.status === 401) {
          toast.error("Sessão expirada. Por favor, faça login novamente.");
          navigate("/login", { replace: true });
        } else {
          toast.error("Erro ao carregar publicações");
        }
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to prevent flash of loading state
    const timer = setTimeout(fetchPosts, 300);
    return () => clearTimeout(timer);
  }, [isAuthenticated, token, navigate]);

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
        <div className="space-y-6">
          {posts.length > 0 ? (
              posts.map((post) => (
                  <PostCard
                      key={`post-${post.id}`}
                      post={post}
                  />
              ))
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