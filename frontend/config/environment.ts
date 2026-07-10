const environment = {
  API_URL: typeof window === "undefined" && process.env.API_URL_INTERNAL
    ? process.env.API_URL_INTERNAL
    : process.env.NEXT_PUBLIC_API_URL || "",
  AUTH_SECRET: process.env.NEXTAUTH_SECRET || "",
};

export default environment;
