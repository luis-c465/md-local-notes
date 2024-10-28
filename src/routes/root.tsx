import { AppSidebar } from "#/app-sidebar";
import { SiteHeader } from "#/site/Header";
import { TailwindIndicator } from "#/site/TailwindIndicator";
import { SidebarProvider } from "#/ui/sidebar";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

import "jotai-devtools/styles.css";

export default function Root() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />

        <div className="relative flex min-h-screen flex-col w-full">
          <SiteHeader />

          <Outlet />
        </div>

        <TailwindIndicator />

        <Toaster />
      </SidebarProvider>

      {/* <DevTools /> */}
    </>
  );
}
