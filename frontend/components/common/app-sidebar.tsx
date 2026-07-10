"use client";

import { useEffect } from "react";
import Link from "next/link";
import { BookOpen, LogOut, MoreVertical, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn, formatRole } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ROLE } from "@/constants/auth.contants";
import { SIDEBAR_ADMIN, SIDEBAR_MEMBER } from "@/constants/sidebar.constants";
import { useAuthStore } from "@/stores/auth-store";

export default function AppSidebar() {
  const { isMobile, setOpenMobile } = useSidebar();
  const user = useAuthStore((state) => state.user);
  const pathname = usePathname();

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [pathname, isMobile, setOpenMobile]);

  if (!user) return null;

  const role = user?.role;

  const groups =
    role === ROLE.ADMIN
      ? [...SIDEBAR_MEMBER, ...SIDEBAR_ADMIN]
      : SIDEBAR_MEMBER;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link
                href="/"
                className="flex items-center gap-3 font-semibold group-data-[collapsible=icon]:h-8! group-data-[collapsible=icon]:w-8! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0!"
              >
                <div className="text-primary-foreground bg-primary rounded-full p-2 group-data-[collapsible=icon]:p-1.5!">
                  <BookOpen className="h-5 w-5 shrink-0" />
                </div>

                <span className="group-data-[collapsible=icon]:hidden">
                  PerpusDigital
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <div className="px-2">
          <SidebarSeparator className="mx-0" />
        </div>

        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-muted-foreground/70 px-3 text-[10px] font-semibold tracking-wider uppercase group-data-[collapsible=icon]:hidden">
              {group.label}
            </SidebarGroupLabel>

            <SidebarGroupContent className="flex flex-col gap-2">
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <Link
                        href={item.href}
                        className={cn(
                          "h-auto px-4 py-3 group-data-[collapsible=icon]:h-8! group-data-[collapsible=icon]:w-8! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0!",
                          {
                            "bg-primary text-primary-foreground hover:bg-primary! hover:text-primary-foreground!":
                              pathname === item.href,
                          },
                        )}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="mt-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-accent-foreground group-data-[collapsible=icon]:h-8! group-data-[collapsible=icon]:w-8! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0!"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="leading-tight group-data-[collapsible=icon]:hidden">
                    <p className="truncate font-semibold">
                      {user?.name || "User"}
                    </p>
                    <p className="text-muted-foreground text-xs capitalize">
                      {formatRole(role)}
                    </p>
                  </div>

                  <MoreVertical className="ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                side={isMobile ? "bottom" : "right"}
              >
                <DropdownMenuLabel className="flex flex-col">
                  <span className="font-semibold">{user?.name}</span>
                  <span className="text-muted-foreground text-xs font-normal">
                    {user?.nis ? `NIS: ${user.nis}` : user?.email}
                  </span>
                  {user?.class && (
                    <span className="text-muted-foreground text-xs font-normal">
                      Kelas: {user.class}
                    </span>
                  )}
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/profile"
                      className="flex w-full cursor-pointer items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex cursor-pointer items-center gap-2 text-red-500"
                  onClick={() =>
                    signOut({ callbackUrl: window.location.origin + "/login" })
                  }
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
