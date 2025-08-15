import { AppLayout } from "@/components/layout/AppLayout";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const NearbyBookstoresPage = () => {
  const defaultMapUrl = "https://maps.google.com/maps?q=livrarias+e+sebos+em+sao+paulo&z=15&output=embed";

  const [mapUrl, setMapUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocalização não é suportada pelo seu navegador.");
      setMapUrl(defaultMapUrl);
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newMapUrl = `https://maps.google.com/maps?q=livrarias+e+sebos&ll=${latitude},${longitude}&z=15&output=embed`;
        setMapUrl(newMapUrl);
        setIsLoading(false);
        toast.success("Livrarias e sebos perto de você encontrados!");
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
        toast.warning("Não foi possível obter sua localização. Mostrando mapa padrão.");
        setMapUrl(defaultMapUrl);
        setIsLoading(false);
      }
    );
  }, []);

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
