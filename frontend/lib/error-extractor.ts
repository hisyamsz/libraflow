import { AxiosError } from "axios";
import { GLOBAL_ERROR_MESSAGES } from "@/constants/error.constants";

interface BackendErrorPayload {
  message?: string | string[];
  meta?: {
    message?: string;
    status?: number;
  };
}

export function extractErrorMessage(error: unknown, defaultMessage = "Terjadi kesalahan sistem"): string {
  if (!error) return defaultMessage;
  
  const axiosError = error as AxiosError<BackendErrorPayload>;
  
  // 1. Deteksi Network Error
  if (axiosError.code === "ERR_NETWORK") {
    return GLOBAL_ERROR_MESSAGES["Network Error"] || "Koneksi ke server gagal. Harap periksa jaringan internet Anda.";
  }
  
  const data = axiosError.response?.data;
  
  // 2. Ekstraksi format API utama backend kita (data.meta.message)
  if (data?.meta?.message) {
    const msg = data.meta.message;
    return GLOBAL_ERROR_MESSAGES[msg] || msg;
  }
  
  // 3. Ekstraksi format standard Express/NestJS (data.message)
  if (data?.message) {
    if (Array.isArray(data.message)) {
      return data.message.map((msg) => GLOBAL_ERROR_MESSAGES[msg] || msg).join(", ");
    }
    const msg = data.message;
    return GLOBAL_ERROR_MESSAGES[msg] || msg;
  }
  
  // 4. Pemetaan berdasarkan Status Code HTTP
  const status = axiosError.response?.status;
  if (status === 401) {
    return GLOBAL_ERROR_MESSAGES["Unauthorized"] || defaultMessage;
  }
  if (status === 403) {
    return GLOBAL_ERROR_MESSAGES["Forbidden"] || defaultMessage;
  }
  if (status === 500) {
    return GLOBAL_ERROR_MESSAGES["Internal Server Error"] || defaultMessage;
  }
  
  // 5. Fallback ke Axios error message bawaan
  const rawMessage = axiosError.message;
  return GLOBAL_ERROR_MESSAGES[rawMessage] || rawMessage || defaultMessage;
}
