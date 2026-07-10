"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DarkModeToggle } from "@/components/common/darkmode-toggle";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRole } from "@/lib/utils";
import { LogOut } from "lucide-react";
export function Navbar() {
  const { user, status } = useAuth();
  const isAuthenticated = status === "authenticated" && user;

  return (
    <header className="border-border/40 dark:border-white/5 bg-background/70 dark:bg-background/40 sticky top-0 z-50 w-full border-b shadow-xs dark:shadow-none backdrop-blur-lg transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-6 md:px-12">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <span className="from-primary to-primary-hover bg-linear-to-r bg-clip-text text-xl font-bold tracking-tight text-transparent transition-opacity group-hover:opacity-90">
            PerpusDigital
          </span>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <DarkModeToggle />

          {status === "loading" ? (
            <Skeleton className="h-8 w-8 rounded-full" />
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="border-border/40 relative h-8 w-8 rounded-full border shadow-sm transition-all hover:scale-105 active:scale-95"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold uppercase">
                      {user?.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="mt-2 w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm leading-none font-semibold">
                      {user?.name}
                    </p>
                    <p className="text-muted-foreground truncate text-xs leading-none">
                      {user?.nis ? `NIS: ${user.nis}` : user?.email}
                    </p>
                    {user?.class && (
                      <p className="text-muted-foreground truncate text-xs leading-none">
                        Kelas: {user.class}
                      </p>
                    )}
                    <p className="text-primary mt-1.5 text-[10px] leading-none font-bold capitalize">
                      {formatRole(user?.role)}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href={user?.role === "ADMIN" ? "/admin" : "/dashboard"}>
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/dashboard/profile">Profil Saya</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-500 focus:bg-red-500/10"
                  onClick={() => signOut({ callbackUrl: window.location.origin + "/" })}
                >
                  <LogOut />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button
                size="sm"
                className="font-medium shadow-sm transition-all hover:scale-[1.02]"
              >
                Masuk
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
