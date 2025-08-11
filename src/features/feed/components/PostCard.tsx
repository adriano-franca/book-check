import type { Post } from "@/@types/posts";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  MessageCircle,
  Send,
  ThumbsUp,
  UserPlus,
} from "lucide-react";

export const PostCard = ({ post }: { post: Post }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0); // opcional

  const toggleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((count) => (liked ? count - 1 : count + 1)); // opcional
  };

  return (
      <Card className="p-4 max-w-full overflow-hidden">
        <div className="flex items-start gap-4">
          <Avatar className="cursor-pointer w-12 h-12 shrink-0">
            <AvatarImage src={post.avatarImage} alt={post?.autor?.nome ?? "Sebo do joão"} />
            <AvatarFallback>
              {post?.autor?.nome ? post.autor.nome
                  .split(" ")
                  .map((part) => part[0].toUpperCase())
                  .slice(0, 2)
                  .join("") : "SJ"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 overflow-hidden">
            <div className="flex justify-between items-center">
              <p className="font-medium cursor-pointer truncate">{post?.autor?.nome ?? "Sebo do joão"}</p>
              <UserPlus size={20} className="text-muted-foreground cursor-pointer shrink-0" />
            </div>

            <p className="text-sm text-muted-foreground break-words mt-1">
              {post.texto}
            </p>

            <div className="mt-4 flex gap-6 text-sky-500 items-center">
              <div className="flex items-center gap-1 cursor-pointer" onClick={toggleLike}>
                <ThumbsUp
                    size={20}
                    className={liked ? "fill-sky-500 text-sky-500" : "text-sky-500"}
                />
                <span className="text-sm">{likeCount}</span>
              </div>

              <Send className="cursor-pointer" />
            </div>
          </div>
        </div>
      </Card>
  );
};
