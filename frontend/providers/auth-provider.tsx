"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/stores/auth-store";
import { UserExtended } from "@/types/Auth";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser(session.user as UserExtended);
    } else if (status === "unauthenticated") {
      setUser(null);
    }
  }, [session, status, setUser]);

  return <>{children}</>;
}
