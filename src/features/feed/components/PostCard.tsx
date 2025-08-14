import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/app/stores/authStore";
import { toggleLikePost } from "../services/curtidaService";

interface Post {
  id: number;
  texto: string;
  autor: {
    id: number;
    nome: string;
  } | null; // Permite que o autor seja nulo
  curtidas?: { autor: { id: number } }[];
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post: initialPost }: PostCardProps) {
  const [post, setPost] = useState(initialPost);
  const { user } = useAuthStore();

  const isLikedByMe = post.curtidas?.some(curtida => curtida.autor.id === user?.id);

  const handleLike = async () => {
    try {
      const updatedPost = await toggleLikePost(post.id);
      setPost(updatedPost);
    } catch (error) {
      toast.error("Erro ao processar curtida.");
      console.error(error);
    }
  };

  // Se o post não tiver autor, podemos optar por não renderizá-lo
  if (!post.autor) {
    return null; // Ou renderizar uma mensagem de "Post inválido"
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center space-x-4">
        <Avatar>
          {/* CORREÇÃO APLICADA AQUI com '?' */}
          <AvatarImage src={`https://i.pravatar.cc/150?u=${post.autor?.id}`} />
          {/* CORREÇÃO APLICADA AQUI com '?' */}
          <AvatarFallback>{post.autor?.nome.charAt(0)}</AvatarFallback>
        </Avatar>
        {/* CORREÇÃO APLICADA AQUI com '?' */}
        <div className="font-semibold">{post.autor?.nome || "Usuário Anônimo"}</div>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{post.texto}</p>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={handleLike}>
            <Heart className={`h-5 w-5 ${isLikedByMe ? 'text-red-500 fill-current' : ''}`} />
          </Button>
          <Button variant="ghost" size="icon">
            <MessageCircle className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {post.curtidas?.length || 0} curtidas
        </p>
      </CardContent>
    </Card>
  );
}