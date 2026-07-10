"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import FormPassword from "@/components/common/form-password";
import {
  changePasswordSchema,
  ChangePasswordForm,
} from "@/validations/user.validation";
import userService from "@/services/user.service";
import { INITIAL_PASSWORD_FORM } from "@/constants/user.constants";

export default function TabSecurity() {
  const form = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: INITIAL_PASSWORD_FORM,
  });

  // Integrasi React Query Mutation untuk performa reaktif dan penanganan state loading/error
  const { mutate: mutateChangePassword, isPending } = useMutation({
    mutationFn: (data: ChangePasswordForm) => {
      return userService.changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      });
    },
    onSuccess: () => {
      toast.success(
        "Kata sandi berhasil diperbarui! Mengalihkan ke halaman login...",
      );
      form.reset(); // Kosongkan input setelah berhasil
      setTimeout(() => {
        signOut({ callbackUrl: window.location.origin + "/login" });
      }, 2000);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const isNetworkError = error?.code === "ERR_NETWORK";
      const message = isNetworkError
        ? "Koneksi ke server gagal. Harap periksa jaringan internet Anda."
        : error?.response?.data?.message ||
          error?.message ||
          "Gagal memperbarui sandi";

      toast.error("Gagal Mengubah Sandi", { description: message });
      form.setError("root", { message });
    },
  });

  const onSubmit = (data: ChangePasswordForm) => {
    form.clearErrors("root");
    mutateChangePassword(data);
  };

  return (
    <Card className="w-full max-w-xl bg-card/75 dark:bg-card/45 border-border/50 dark:border-white/5 shadow-sm backdrop-blur-md">
      <CardContent className="px-6 py-4 sm:px-8 sm:py-6">
        <div className="w-full">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <div className="mb-4 space-y-1">
              <h3 className="text-lg font-bold">Ubah Kata Sandi</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Sandi Anda harus minimal 6 karakter. Pastikan sandi baru kuat
                dan tidak mudah ditebak.
              </p>
            </div>

            <FormPassword
              form={form}
              name="oldPassword"
              label="Kata Sandi Lama"
              placeholder="Masukkan sandi lama"
              required
              disabled={isPending}
            />

            <FormPassword
              form={form}
              name="newPassword"
              label="Kata Sandi Baru"
              placeholder="Masukkan sandi baru"
              required
              disabled={isPending}
            />

            <FormPassword
              form={form}
              name="confirmNewPassword"
              label="Konfirmasi Kata Sandi Baru"
              placeholder="Ulangi sandi baru"
              required
              disabled={isPending}
            />

            {form.formState.errors.root && (
              <div className="bg-destructive/10 text-destructive border-destructive/20 animate-in fade-in rounded-md border p-3 text-center text-xs font-semibold duration-200">
                {form.formState.errors.root.message}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isPending}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="min-w-[120px]"
              >
                {isPending ? (
                  <>
                    <Spinner className="mr-2" />
                    Menyimpan...
                  </>
                ) : (
                  "Perbarui Sandi"
                )}
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
