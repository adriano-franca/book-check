import { Topbar } from "./TopbarLayout";
import { SidebarLayout } from "./SidebarLayout";
import { cn } from "@/lib/utils";

export const AppLayout = ({
  children,
  hideSidebar,
  mainClassname,
}: {
  children: React.ReactNode;
  hideSidebar?: boolean;
  mainClassname?: string;
}) => {
  return (
    <div className="min-h-screen">
      <Topbar />

      <div className={cn("flex-1 grid max-w-screen", {
        "grid-cols-[1fr_3fr]": !hideSidebar,
        "grid-cols-[1fr]": hideSidebar,
      })}>
        {!hideSidebar && <SidebarLayout />}

        <div className={cn("flex flex-col py-6 gap-6", {
          "w-[70%] max-w-[70%]": !hideSidebar,
          "max-w-screen": hideSidebar
        }, mainClassname)}>{children}</div>
      </div>
    </div>
  );
};
