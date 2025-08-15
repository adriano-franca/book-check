import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/app/stores/authStore";
import { getCatalogo, removeCatalogo, type CatalogoBook } from "../services/catalogoService";
import { toast } from "sonner";
import { BookExtensiveCard } from "@/features/books/components/BookExtensiveCard";
import { AddBookToCatalogModal } from "../components/AddBookToCatalogoModal";
import { EditCatalogItemModal } from "../components/EditCatalogItemModal"; // 1. Importar o novo modal

export const CatalogoPage = () => {
  const { user } = useAuthStore();
  const [catalogo, setCatalogo] = useState<CatalogoBook[]>([]);
  const [isLoadingCatalogo, setIsLoadingCatalogo] = useState(true);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // 2. Estados para controlar o modal de edição
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBookForEdit, setSelectedBookForEdit] = useState<CatalogoBook | null>(null);

  const fetchCatalogo = useCallback(async () => {
    if (!user?.id) return;
    setIsLoadingCatalogo(true);
    try {
      const books = await getCatalogo(user.id);
      setCatalogo(books);
    } catch (error) {
      toast.error("Erro ao carregar seu catálogo.");
    } finally {
      setIsLoadingCatalogo(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCatalogo();
  }, [fetchCatalogo]);

  // 3. Função para abrir o modal de edição com o livro selecionado
  const handleOpenEditModal = (book: CatalogoBook) => {
    setSelectedBookForEdit(book);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (book: CatalogoBook) => {
    if (!window.confirm(`Tem certeza que deseja remover "${book.title}" do seu catálogo?`)) return;

    try {
        await removeCatalogo(book.catalogoId);
        toast.success("Livro removido com sucesso!");
        fetchCatalogo();
    } catch (error) {
        toast.error("Erro ao remover livro.");
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-4 max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Gerenciar Catálogo</h1>
          <Button onClick={() => setIsAddModalOpen(true)}>Adicionar Livro ao Catálogo</Button>
        </div>
        
        {isLoadingCatalogo ? (
          <p className="text-center text-muted-foreground mt-4">Carregando seu catálogo...</p>
        ) : catalogo.length > 0 ? (
          <div className="flex flex-col gap-4">
            {catalogo.map((book) => (
              <BookExtensiveCard 
                key={book.catalogoId} 
                book={book} 
                type="catalogo"
                onDelete={() => handleDelete(book)}
                // 4. Passar a função de edição para o card
                onEdit={() => handleOpenEditModal(book)}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 border-2 border-dashed rounded-lg mt-4 text-center">
            <p className="text-muted-foreground">Nenhum livro cadastrado no seu catálogo.</p>
            <p className="text-sm text-muted-foreground/80">Clique em "Adicionar Livro" para começar.</p>
          </div>
        )}
      </div>

      <AddBookToCatalogModal 
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onBookAdded={fetchCatalogo}
      />
      
      {/* 5. Renderizar o modal de edição */}
      <EditCatalogItemModal
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onBookUpdated={fetchCatalogo}
          book={selectedBookForEdit}
      />
    </AppLayout>
  );
};