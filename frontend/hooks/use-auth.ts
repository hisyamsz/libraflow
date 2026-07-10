import { useSession } from "next-auth/react";
import { UserExtended } from "@/types/Auth";

export function useAuth() {
  const { data, status, update } = useSession();

  return {
    user: data?.user as UserExtended | undefined,
    status,
    update,
  };
}
