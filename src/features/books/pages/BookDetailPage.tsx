import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const BookDetailPage = () => {
  const navigate = useNavigate();

  return (
    <AppLayout hideSidebar>
      <div className="p-6">
        <a
          className="mb-6 flex items-center gap-2 cursor-pointer hover:text-sky-700 transition-colors duration-200"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
          Voltar
        </a>

        <div className="flex-1 flex items-center justify-center gap-10 p-10">
          <img
            src="https://placehold.co/400x600/png?text=Capa+do+Livro"
            alt="Capa do livro"
            className="w-[260px] rounded shadow-lg"
          />

          <div className="max-w-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">AMANHECER NA COLHEITA</h1>
                <p className="text-sm text-sky-800 font-medium">
                  Suzanne Collins
                </p>
                <p className="text-xl font-semibold mt-2">R$ 49,90</p>

                <div className="text-sm text-muted-foreground mt-2 leading-6">
                  <p>
                    <strong>2017</strong> Páginas: 352
                  </p>
                  <p>
                    <strong>ISBN:</strong> 9780751565362{" "}
                    <strong>ISBN10:</strong> 0751565369
                  </p>
                  <p>
                    <strong>Adicionado:</strong> 21/09/2023
                  </p>
                  <p>
                    <strong>Sebo:</strong>{" "}
                    <a href="#" className="text-sky-700 underline">
                      Sebo do Lusca
                    </a>
                  </p>
                </div>
              </div>
              <Badge className="bg-blue-100 text-black border border-blue-400 rounded-full">
                Bom Estado
              </Badge>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-bold border-b-2 border-sky-700 inline-block pb-1 mb-2">
                Descrição
              </h2>
              <p className="text-sm leading-relaxed text-black">
                Sempre foi difícil ser Harry Potter e não é muito mais fácil
                agora que ele é um funcionário sobrecarregado do Ministério da
                Magia, marido e pai de três filhos em idade escolar. Enquanto
                Harry lida com um passado que se recusa a ficar onde pertence,
                seu filho mais novo, Albus, precisa lutar com o peso de um
                legado familiar que ele nunca quis. A medida que passado e
                presente se fundem ameaçadoramente, pai e filho aprendem a
                verdade incômoda: às vezes, a escuridão vem de lugares
                inesperados. O roteiro de Harry Potter e a Criança Amaldiçoada
                foi originalmente lançado como uma "edição especial de ensaio"
                junto com a abertura da peça de Jack Thorne no West End de
                Londres no verão de 2016. Baseada em uma história original de
                J.K. Rowling, John Tiffany e Jack Thorne, a peça abriu para
                críticas arrebatadoras.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
