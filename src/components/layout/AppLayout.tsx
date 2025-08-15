import { TopbarLayout } from "./TopbarLayout";
import { SidebarLayout } from "./SidebarLayout";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/app/stores/authStore";
import ChatPage from "@/features/chat/pages/ChatPage";

export const AppLayout = ({
  children,
  hideSidebar,
  mainClassname,
}: {
  children: React.ReactNode;
  hideSidebar?: boolean;
  mainClassname?: string;
}) => {
  const { token, user } = useAuthStore();
  return (
    <div className="min-h-screen">
      <TopbarLayout />

      <div
        className={cn("flex-1 grid max-w-screen", {
          "grid-cols-[1fr_3fr]": !hideSidebar,
          "grid-cols-[1fr]": hideSidebar,
        })}
      >
        {!hideSidebar && <SidebarLayout />}

        <div
          className={cn(
            "flex flex-col py-6 gap-6",
            {
              "w-[70%] max-w-[70%]": !hideSidebar,
              "max-w-screen": hideSidebar,
            },
            mainClassname
          )}
        >
          {children}
        </div>
      </div>

      <ChatPage currentUserId={user?.id ?? 1} apiBaseUrl={"http://localhost:8080"} token={token} />
    </div>
  );
};
