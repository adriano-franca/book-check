import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppLayout } from "@/components/layout/AppLayout";
import { posts as dataPosts } from "@/data/post";
import { PostCard } from "@/features/feed/components/PostCard";

export const UserDetailPage = () => {
  const posts = dataPosts;
  return (
    <AppLayout>
      <div className="p-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <Avatar className="w-32 h-32">
              <AvatarImage src="/avatar.jpg" />
              <AvatarFallback>LF</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Lucas Farias</h1>
              <p className="text-muted-foreground">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
            </div>
          </div>
          <Button className="bg-sky-400 hover:bg-sky-500 text-black font-semibold">
            Seguir
          </Button>
        </div>

        <div className="mt-12">
          <h2 className="text-lg font-bold mb-4">Publicações</h2>
          {posts.map((post) => (
            <div className="mb-3">
              <PostCard key={post.id} post={post} />
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};
