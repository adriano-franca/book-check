import { AppLayout } from "@/components/layout/AppLayout";
import { PostCard } from "../components/PostCard";
import { posts as dataPosts } from "@/data/post";

export const HomePage = () => {
  const posts = dataPosts;

  return (
    <AppLayout>
      {posts.map((post, index) => (
        <PostCard
          key={index}
          post={post}
        />
      ))}
    </AppLayout>
  );
};
