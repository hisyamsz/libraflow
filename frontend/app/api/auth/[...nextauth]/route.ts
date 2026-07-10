import environment from "@/config/environment";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  JWTExtended,
  SessionExtended,
  UserExtended,
} from "@/types/Auth";
import authServices from "@/services/auth.service";
import { LoginForm } from "@/validations/auth.validation";
import axios from "axios";

const handler = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },

  secret: environment.AUTH_SECRET,

  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",

      credentials: {
        identifier: { label: "identifier", type: "text" },
        password: { label: "password", type: "password" },
      },

      async authorize(
        credentials: Record<"identifier" | "password", string> | undefined,
      ): Promise<UserExtended | null> {
        if (!credentials) return null;

        const { identifier, password } = credentials as LoginForm;

        try {
          const result = await authServices.login({
            identifier,
            password,
          });

          const accessToken = result.data.data;

          if (!accessToken) {
            throw new Error("NIS / Email atau Password salah");
          }

          const profileRes = await authServices.getProfileWithToken(accessToken);

          const user = profileRes.data.data;

          if (
            accessToken &&
            result.status === 200 &&
            user.id &&
            profileRes.status === 200
          ) {
            user.accessToken = accessToken;
            return user;
          } else {
            throw new Error("NIS / Email atau Password salah");
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            // 1. Deteksi Gagal Koneksi / Salah URL di .env / Server Offline (Tidak ada response dari server)
            if (!error.response) {
              throw new Error("Gagal terhubung ke server");
            }

            // 2. Deteksi Internal Server Error (500)
            const status = error.response?.status;
            if (status === 500) {
              throw new Error("Server backend sedang bermasalah (Internal Server Error). Silakan coba beberapa saat lagi.");
            }

            // 3. Ambil pesan validasi/error spesifik dari backend (multi-bahasa)
            const responseData = error.response?.data as { meta?: { message?: string }; message?: string | string[] } | undefined;
            const backendMessage = responseData?.meta?.message || (Array.isArray(responseData?.message) ? responseData?.message[0] : responseData?.message);
            if (backendMessage) {
              throw new Error(backendMessage);
            }
          }

          // 4. Fallback default
          throw new Error("NIS / Email atau Password salah");
        }
      },
    }),
  ],

  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
      }
      return baseUrl;
    },

    async jwt({
      token,
      user,
    }: {
      token: JWTExtended;
      user: UserExtended | null;
    }) {
      if (user) {
        token.user = user;
      }

      return token;
    },

    async session({
      session,
      token,
    }: {
      session: SessionExtended;
      token: JWTExtended;
    }) {
      if (!token.user) return session;

      session.user = token.user;
      session.accessToken = token.user?.accessToken;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
