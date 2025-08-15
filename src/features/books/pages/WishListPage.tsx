import { AppLayout } from "@/components/layout/AppLayout";
import { BookExtensiveCard } from "../components/BookExtensiveCard";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/stores/authStore";
import { getWishlist, type WishlistBook } from "../services/wishListService";
import { toast } from "sonner";

export const WishListPage = () => {
  const { user } = useAuthStore();
  const [wishlistBooks, setWishlistBooks] = useState<WishlistBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?.id) return;
      try {
        setIsLoading(true);
        const books = await getWishlist(user.id);
        setWishlistBooks(books);
      } catch (error) {
        toast.error("Erro ao carregar sua lista de desejos.");
        console.error("Erro ao buscar wishlist:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWishlist();
  }, [user]);
  
  return (
    <AppLayout>
      <div className="flex flex-col gap-3 max-w-4xl">
        <h1 className="text-2xl font-bold">Minha Lista de Desejos</h1>
        {isLoading ? (
          <p className="text-center text-muted-foreground mt-4">Carregando sua lista de desejos...</p>
        ) : wishlistBooks.length > 0 ? (
          wishlistBooks.map((book) => (
            <BookExtensiveCard key={book.wishlistId} book={book} type="wishlist" />
          ))
        ) : (
          <p className="text-center text-muted-foreground mt-4">
            Sua lista de desejos está vazia.
          </p>
        )}
      </div>
    </AppLayout>
  );
};