import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { AuthorListPage } from "@/features/authors/pages/AuthorListPage";
import { BookCasePage } from "@/features/books/pages/BookCasePage";
import { BookDetailPage } from "@/features/books/pages/BookDetailPage";
import { BookListPage } from "@/features/books/pages/BookListPage";
import { WishListPage } from "@/features/books/pages/WishListPage";
import { HomePage } from "@/features/feed/pages/HomePage";
import { NearbyBookstoresPage } from "@/features/publishers/pages/NearbyBookstoresPage.";
import { PublisherListPage } from "@/features/publishers/pages/PublisherListPage";
import { UserDetailPage } from "@/features/user/pages/UserDetailPage";
import { type RouteObject } from "react-router-dom";
import { AuthorDetailPage } from "@/features/authors/pages/AuthorDetailPage";
import { PublisherDetailPage } from '@/features/publishers/pages/PublisherDetailPage';
import { CatalogoPage } from '@/features/sebo/pages/CatalogoPage';
import ChatPage from "@/features/chat/pages/ChatPage";
import { useAuthStore } from "@/app/stores/authStore";

const ChatPageRoute = () => {
  const { user, token } = useAuthStore();

  if (!user) {
    return <div>Carregando...</div>; 
  }

  return <ChatPage currentUserId={user.id} apiBaseUrl={"http://localhost:8080"} token={token ?? undefined} />;
}

export const authRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/livrarias-proximas",
        element: <NearbyBookstoresPage />,
      },
      {
        path: "/lista-de-desejos",
        element: <WishListPage />,
      },
      {
        path: "/estante",
        element: <BookCasePage />,
      },
      {
        path: "/configuracoes",
        element: <HomePage />,
      },
      {
        path: "/sair",
        element: <HomePage />,
      },
      {
        path: "/livro/:id",
        element: <BookDetailPage />,
      },
      {
        path: "/:userId",
        element: <UserDetailPage />,
      },
      {
        path: "/livros",
        element: <BookListPage />,
      },
      {
        path: "/autores",
        element: <AuthorListPage />,
      },
      {
        path: "/author/:id",
        element: <AuthorDetailPage/>
      },
      {
        path: "/editoras",
        element: <PublisherListPage />,
      },
      {
        path: "/editoras/:id",
        element: <PublisherDetailPage />,
      },
      {
        path: "/sebo/catalogo",
        element: <CatalogoPage />,
      },
      {
        path: "/chat",
        element: <ChatPageRoute />,
      },
    ],
  },
];