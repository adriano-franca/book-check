import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateCatalogo, EstadoConservacao, DisponibilidadeCatalogo, type CatalogoBook } from "../services/catalogoService";
import { toast } from "sonner";

interface EditCatalogItemModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onBookUpdated: () => void; // Função para avisar a página principal que um livro foi atualizado
  book: CatalogoBook | null;
}

export const EditCatalogItemModal = ({ isOpen, onOpenChange, onBookUpdated, book }: EditCatalogItemModalProps) => {
  // Estados do formulário
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [estado, setEstado] = useState<EstadoConservacao | ''>('');
  const [status, setStatus] = useState<DisponibilidadeCatalogo | ''>('');

  // Efeito para preencher o formulário quando um livro é selecionado para edição
  useEffect(() => {
    if (book) {
      setPreco(String(book.preco));
      setQuantidade(String(book.quantidade));
      setEstado(book.estadoConservacao);
      setStatus(book.status);
    }
  }, [book]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book || !estado || !status || !preco || !quantidade) {
        toast.error("Por favor, preencha todos os campos.");
        return;
    }
    
    try {
        await updateCatalogo(book.catalogoId, {
            preco: parseFloat(preco),
            quantidade: parseInt(quantidade, 10),
            estadoConservacao: estado,
            status: status,
        });
        toast.success(`"${book.title}" foi atualizado com sucesso!`);
        onBookUpdated(); // Avisa a página principal para recarregar a lista
        onOpenChange(false); // Fecha o modal
    } catch (error: any) {
        toast.error(error?.response?.data?.message || "Erro ao atualizar o livro.");
    }
  };

  if (!book) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar "{book.title}"</DialogTitle>
        </DialogHeader>
        
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
            <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
                <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
      </DialogContent>
    </Dialog>
  )
}