import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/app/stores/authStore";
import { toggleLikePost } from "../services/curtidaService";
import { Input } from "@/components/ui/input";
import { createComment } from "../services/comentarioService";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Author {
  id: number;
  nome: string;
}

interface Comment {
  id: number;
  texto: string;
  autor: Author;
}

interface Post {
  id: number;
  texto: string;
  autor: Author | null;
  curtidas?: { autor: { id: number } }[];
  comentarios?: Comment[];
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post: initialPost }: PostCardProps) {
  const [post, setPost] = useState(initialPost);
  const [newComment, setNewComment] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const isLikedByMe = post.curtidas?.some(
    (curtida) => curtida.autor.id === user?.id
  );

  const handleLike = async () => {
    try {
      const updatedPost = await toggleLikePost(post.id);
      setPost(updatedPost);
    } catch (error) {
      toast.error("Erro ao processar curtida.");
      console.error(error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      toast.error("O comentário não pode estar vazio.");
      return;
    }
    try {
      const createdComment = await createComment({
        texto: newComment,
        publicacaoId: post.id,
      });

      setPost((prevPost) => ({
        ...prevPost,
        comentarios: [...(prevPost.comentarios || []), createdComment],
      }));
      setNewComment("");
      toast.success("Comentário adicionado!");
    } catch (error) {
      toast.error("Erro ao adicionar comentário.");
      console.error(error);
    }
  };

  if (!post.autor) {
    return null;
  }

  const navigateToProfile = (userId?: number) => {
    if (userId) {
      navigate(`/${userId}`);
    }
  };

  // Card principal sem comentários
  return (
    <>
      <Card
        className="w-full max-w-2xl mx-auto cursor-pointer"
        onClick={() => setModalOpen(true)}
      >
        <CardHeader
          className="flex flex-row items-center space-x-4"
          onClick={(e) => {
            e.stopPropagation();
            navigateToProfile(post.autor?.id);
          }}
        >
          <Avatar>
            <AvatarImage
              src={`https://i.pravatar.cc/150?u=${post.autor?.id}`}
            />
            <AvatarFallback>{post.autor?.nome.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="font-semibold">
            {post.autor?.nome || "Usuário Anônimo"}
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{post.texto}</p>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
            >
              <Heart
                className={`h-5 w-5 ${
                  isLikedByMe ? "text-red-500 fill-current" : ""
                }`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setModalOpen(true);
              }}
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {post.curtidas?.length || 0} curtidas
          </p>
        </CardContent>
      </Card>

      {/* Dialog com post + comentários */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="min-w-[900px] h-[600px] p-0 flex overflow-hidden">
          <div className="flex w-full h-full">
            {/* Coluna do post */}
            <div className="flex-1 p-8 border-r overflow-auto">
              <div className="flex flex-row items-center space-x-4 mb-4">
                <Avatar>
                  <AvatarImage
                    src={`https://i.pravatar.cc/150?u=${post.autor?.id}`}
                  />
                  <AvatarFallback>{post.autor?.nome.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="font-semibold">
                  {post.autor?.nome || "Usuário Anônimo"}
                </div>
              </div>
              <p className="mb-4 text-lg">{post.texto}</p>
              <div className="flex items-center space-x-4 mb-2">
                <Button variant="ghost" size="icon" onClick={handleLike}>
                  <Heart
                    className={`h-5 w-5 ${
                      isLikedByMe ? "text-red-500 fill-current" : ""
                    }`}
                  />
                </Button>
                <span className="text-sm text-muted-foreground">
                  {post.curtidas?.length || 0} curtidas
                </span>
              </div>
            </div>
            {/* Coluna dos comentários */}
            <div className="w-[350px] flex flex-col h-full">
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="space-y-2 mb-4">
                  {post.comentarios && post.comentarios.length > 0 ? (
                    post.comentarios.map((comment) => (
                      <div key={comment.id} className="text-sm">
                        <span className="font-semibold">
                          {comment.autor.nome}:{" "}
                        </span>
                        <span>{comment.texto}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Nenhum comentário ainda.
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4 border-t flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Adicione um comentário..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
                />
                <Button onClick={handleCommentSubmit}>Comentar</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
