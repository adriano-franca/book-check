import { useState, useEffect } from 'react';
import type { Book } from '@/@types/books';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/app/stores/authStore';
import { getWishlist, addToWishlist, removeFromWishlist } from "../services/wishListService";
import { toast } from 'sonner';
import { Bookmark, BookmarkCheck } from 'lucide-react';

interface AddToWishlistButtonProps {
  book: Book;
}

export const AddToWishlistButton = ({ book }: AddToWishlistButtonProps) => {
  const { user } = useAuthStore();
  const [wishlistItemId, setWishlistItemId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!user?.id || !book.id) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const wishlist = await getWishlist(user.id);
        const item = wishlist.find((b) => b.id === book.id);
        if (item) {
          setWishlistItemId(item.wishlistId);
        } else {
          setWishlistItemId(null);
        }
      } catch (error) {
        console.error("Erro ao verificar lista de desejos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkWishlistStatus();
  }, [book.id, user]);

  const handleToggleWishlist = async () => {
    if (!user?.id) {
      toast.error("Você precisa estar logado para realizar esta ação.");
      return;
    }

    setIsLoading(true);
    try {
      if (wishlistItemId) {
        await removeFromWishlist(wishlistItemId);
        setWishlistItemId(null);
        toast.success("Livro removido da sua lista de desejos!");
      } else {
        const newItem = await addToWishlist({
          leitorId: user.id,
          workId: book.id,
        });
        setWishlistItemId(newItem.id);
        toast.success("Livro adicionado à sua lista de desejos!");
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Ocorreu um erro.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isInWishlist = wishlistItemId !== null;

  return (
    <Button
      variant="outline"
      onClick={handleToggleWishlist}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {isLoading ? (
        "Carregando..."
      ) : isInWishlist ? (
        <>
          <BookmarkCheck className="text-green-500" size={16} />
          <span>Na Lista de Desejos</span>
        </>
      ) : (
        <>
          <Bookmark size={16} />
          <span>Adicionar aos Desejos</span>
        </>
      )}
    </Button>
  );
};