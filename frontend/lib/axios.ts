import environment from "@/config/environment";
import { SessionExtended } from "@/types/Auth";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";

const headers = {
  "Content-Type": "application/json",
};

const instance = axios.create({
  baseURL: environment.API_URL,
  headers,
  timeout: 60 * 1000,
});

instance.interceptors.request.use(
  async (request) => {
    // 1. Ambil token otentikasi (Kode yang sudah ada)
    let accessToken = useAuthStore.getState().user?.accessToken;

    if (!accessToken) {
      const session: SessionExtended | null = await getSession();
      if (session && session.accessToken) {
        accessToken = session.accessToken;
      }
    }

    if (accessToken) {
      request.headers.Authorization = `Bearer ${accessToken}`;
    }

    // 2. Suntikkan bahasa ke HTTP Header (default Indonesia)
    request.headers["Accept-Language"] = "id";

    return request;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      toast.error("Sesi Anda telah berakhir", {
        description: "Harap login kembali untuk melanjutkan.",
      });
      
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        if (currentPath !== "/login") {
           window.location.href = `/login?callbackUrl=${encodeURIComponent(currentPath)}`;
        }
      }
    } else if (status === 403) {
      toast.error("Akses Ditolak", {
        description: "Anda tidak memiliki izin untuk melakukan tindakan ini.",
      });
    }

    return Promise.reject(error);
  }
);

export default instance;
