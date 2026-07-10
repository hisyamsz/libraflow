import { UseFormSetError, FieldValues, Path } from "react-hook-form";
import { AxiosError } from "axios";

interface BackendValidationErrorPayload {
  message: string;
  error?: string;
  data?: Record<string, string[] | string>;
}

export function mapBackendErrorsToForm<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>
): boolean {
  const axiosError = error as AxiosError<BackendValidationErrorPayload>;
  const data = axiosError.response?.data;

  // Jika response memiliki detail validasi field
  if (axiosError.response?.status === 400 && data?.data) {
    const fieldErrors = data.data;

    Object.keys(fieldErrors).forEach((field) => {
      const errorVal = fieldErrors[field];
      const errorMessage = Array.isArray(errorVal) ? errorVal[0] : errorVal;

      setError(field as Path<T>, {
        type: "server",
        message: errorMessage,
      });
    });
    
    return true; // Berhasil dipetakan secara spesifik
  }

  return false; // Error generik umum
}
