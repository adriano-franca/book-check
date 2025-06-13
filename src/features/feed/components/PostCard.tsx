import type { Post } from "@/@types/posts";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { MessageCircle, Send, ThumbsUp, UserPlus } from "lucide-react";

export const PostCard = ({ post }: { post: Post }) => {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        <Avatar className="size-12 cursor-pointer">
          <AvatarImage src={post.avatarImage} alt={post.username} />
          <AvatarFallback>{post.avatarFallback}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between">
            <p className="font-medium cursor-pointer">{post.username}</p>
            <UserPlus size={24} className="text-muted-foreground cursor-pointer" />
          </div>
          <div className="max-w-prose">
            {post.content}
          </div>

          <div className="mt-4 flex gap-6 text-sky-500">
            <ThumbsUp className="cursor-pointer" />
            <MessageCircle className="cursor-pointer" />
            <Send className="cursor-pointer" />
          </div>
        </div>
      </div>
    </Card>
  );
};
