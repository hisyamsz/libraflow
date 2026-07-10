import AppBreadcrumb from "@/components/common/app-breadcrumb";
import AppSidebar from "@/components/common/app-sidebar";
import { DarkModeToggle } from "@/components/common/darkmode-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen>
      <TooltipProvider delayDuration={0}>
        <AppSidebar />
        <SidebarInset className="overflow-x-hidden">
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="cursor-pointer" size="icon-lg" />
              <Separator
                orientation="vertical"
                className="mr-2 h-8 self-center"
              />
              <AppBreadcrumb />
            </div>
            <div className="px-4">
              <DarkModeToggle />
            </div>
          </header>
          <main className="flex flex-1 flex-col items-start gap-4 px-4 py-2 md:p-4">
            <div className="mx-auto w-full max-w-[1400px] px-2 py-4 md:p-4">
              {children}
            </div>
          </main>
        </SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  );
}
