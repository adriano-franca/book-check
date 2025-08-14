import { AppLayout } from "@/components/layout/AppLayout";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const NearbyBookstoresPage = () => {
  // URL padrão do mapa, centralizado em um local genérico (Avenida Paulista, São Paulo)
  const defaultMapUrl = "https://maps.google.com/maps?q=livrarias+e+sebos+em+sao+paulo&z=15&output=embed";

  // Estado para armazenar a URL do mapa e o status do carregamento
  const [mapUrl, setMapUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verifica se o navegador suporta a API de Geolocalização
    if (!navigator.geolocation) {
      toast.error("Geolocalização não é suportada pelo seu navegador.");
      setMapUrl(defaultMapUrl);
      setIsLoading(false);
      return;
    }

    // Pede a localização do usuário
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Constrói a nova URL do mapa com as coordenadas do usuário e a busca por "livrarias e sebos"
        const newMapUrl = `https://maps.google.com/maps?q=livrarias+e+sebos&ll=${latitude},${longitude}&z=15&output=embed`;
        setMapUrl(newMapUrl);
        setIsLoading(false);
        toast.success("Livrarias e sebos perto de você encontrados!");
      },
      (error) => {
        // Trata os erros (permissão negada, etc.)
        console.error("Erro ao obter localização:", error);
        toast.warning("Não foi possível obter sua localização. Mostrando mapa padrão.");
        setMapUrl(defaultMapUrl);
        setIsLoading(false);
      }
    );
  }, []); // O array vazio assegura que este efeito rode apenas uma vez, quando o componente montar

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-4">
        <h1 className="text-2xl font-bold">Livrarias e Sebos Próximos</h1>
        <div className="w-full max-w-[100%] h-[80vh] rounded-lg overflow-hidden shadow border flex items-center justify-center bg-muted">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              <span>Obtendo sua localização para encontrar livrarias...</span>
            </div>
          ) : (
            <iframe
              title="Mapa de Livrarias e Sebos Próximos"
              src={mapUrl}
              width="100%"
              height="100%"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full border-0"
            ></iframe>
          )}
        </div>
      </div>
    </AppLayout>
  );
};
