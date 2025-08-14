import { AppLayout } from "@/components/layout/AppLayout";

export const NearbyBookstoresPage = () => {
  return (
    <AppLayout>
      <div className="flex-1 flex justify-center p-4">
        <div className="w-full max-w-[100%] min-h-[80vh] rounded-lg overflow-hidden shadow border">
          <iframe
            title="Mapa de Sebos Próximos"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.5948743457956!2d-46.647261084481!3d-23.584103668373998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59cda1234567%3A0xf1c2920b1f1a2b2c!2sSebo+do+Centro!5e0!3m2!1spt-BR!2sbr!4v1710000000000"
            width="100%"
            height="100%"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          ></iframe>
        </div>
      </div>
    </AppLayout>
  );
};
