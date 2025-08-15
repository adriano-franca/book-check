import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // 'DialogFooter' removido daqui
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounce } from "@/app/hooks/useDebounce";
import { useAuthStore } from "@/app/stores/authStore";
import { searchOpenLibrary, type LivroResultado } from "@/features/search/searchService";
import { addToCatalogo, EstadoConservacao, DisponibilidadeCatalogo } from "../services/catalogoService";
import { toast } from "sonner";

interface AddBookToCatalogModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onBookAdded: () => void;
}

export const AddBookToCatalogModal = ({ isOpen, onOpenChange, onBookAdded }: AddBookToCatalogModalProps) => {
  const { user } = useAuthStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LivroResultado[]>([]);
  const [selectedBook, setSelectedBook] = useState<LivroResultado | null>(null);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [estado, setEstado] = useState<EstadoConservacao | ''>('');
  const [status, setStatus] = useState<DisponibilidadeCatalogo | ''>('');

  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchQuery.length > 2) {
        setIsLoadingSearch(true);
        try {
          const results = await searchOpenLibrary(debouncedSearchQuery);
          setSearchResults(results.livros);
        } catch (error) {
          toast.error("Erro ao buscar livros.");
        } finally {
          setIsLoadingSearch(false);
        }
      } else {
        setSearchResults([]);
      }
    };
    if(isOpen) {
      performSearch();
    }
  }, [debouncedSearchQuery, isOpen]);

  const handleSelectBook = (book: LivroResultado) => {
    setSelectedBook(book);
    setSearchQuery('');
    setSearchResults([]);
  };

  const resetState = () => {
    onOpenChange(false);
    setTimeout(() => {
        setSearchQuery('');
        setSearchResults([]);
        setSelectedBook(null);
        setPreco('');
        setQuantidade('');
        setEstado('');
        setStatus('');
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook || !estado || !status || !preco || !quantidade || !user?.id) {
        toast.error("Por favor, preencha todos os campos.");
        return;
    }
    
    try {
        await addToCatalogo({
            seboId: user.id,
            workId: selectedBook.id.replace("/works/", ""),
            preco: parseFloat(preco),
            quantidade: parseInt(quantidade, 10),
            estadoConservacao: estado,
            status: status,
        });
        toast.success(`"${selectedBook.titulo}" foi adicionado ao seu catálogo!`);
        onBookAdded();
        resetState();
    } catch (error: any) {
        toast.error(error?.response?.data?.message || "Erro ao adicionar livro.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]" onInteractOutside={resetState}>
        <DialogHeader>
          <DialogTitle>{selectedBook ? `Adicionar "${selectedBook.titulo}"` : 'Buscar Livro para Adicionar'}</DialogTitle>
        </DialogHeader>
        
        {!selectedBook ? (
          <div className="flex flex-col gap-4 py-4">
            <Input
              placeholder="Digite o nome do livro ou autor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="max-h-60 overflow-y-auto">
              {isLoadingSearch && <p className="p-2 text-sm text-muted-foreground">Buscando...</p>}
              {searchResults.map(book => (
                <div key={book.id} onClick={() => handleSelectBook(book)} className="p-2 hover:bg-accent rounded cursor-pointer">
                  <p className="font-semibold">{book.titulo}</p>
                  <p className="text-sm text-muted-foreground">{book.autor}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="preco" className="text-right">Preço (R$)</Label>
                <Input id="preco" type="number" step="0.01" value={preco} onChange={e => setPreco(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantidade" className="text-right">Quantidade</Label>
                <Input id="quantidade" type="number" step="1" value={quantidade} onChange={e => setQuantidade(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="estado" className="text-right">Estado</Label>
                <Select onValueChange={(value: EstadoConservacao) => setEstado(value)} value={estado}>
                    <SelectTrigger className="col-span-3"><SelectValue placeholder="Selecione o estado de conservação" /></SelectTrigger>
                    <SelectContent>
                        {Object.values(EstadoConservacao).map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}
                    </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                 <Select onValueChange={(value: DisponibilidadeCatalogo) => setStatus(value)} value={status}>
                    <SelectTrigger className="col-span-3"><SelectValue placeholder="Selecione a disponibilidade" /></SelectTrigger>
                    <SelectContent>
                        {Object.values(DisponibilidadeCatalogo).map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}
                    </SelectContent>
                </Select>
              </div>
            </div>
            {/* O 'DialogFooter' foi substituído por uma div simples */}
            <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="ghost" onClick={() => setSelectedBook(null)}>Voltar para busca</Button>
                <Button type="submit">Adicionar ao Catálogo</Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}