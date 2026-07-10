"use client";

import { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/query-key.constants";
import { extractErrorMessage } from "@/lib/error-extractor";
import { mapBackendErrorsToForm } from "@/lib/form-helper";
import { convertClassToRoman } from "@/lib/class-converter";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FieldGroup,
  FieldSet,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import FormInput from "@/components/common/form-input";
import FormPassword from "@/components/common/form-password";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  createUserSchema,
  CreateUserForm,
} from "@/validations/user.validation";
import { INITIAL_USER_FORM } from "@/constants/user.constants";
import userService from "@/services/user.service";
import { UserPayload } from "@/types/User";

interface DialogAddUserProps {
  open: boolean;
  handleChangeAction: (open: boolean) => void;
}

export default function DialogAddUser({
  open,
  handleChangeAction,
}: DialogAddUserProps) {
  const queryClient = useQueryClient();

  const form = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: INITIAL_USER_FORM,
  });

  const passwordValue = useWatch({ control: form.control, name: "password" });
  const watchedRole = useWatch({ control: form.control, name: "role" });

  // Tampilkan field Kelas hanya jika role = MEMBER
  const showClassField = watchedRole === "MEMBER";

  useEffect(() => {
    if (open) {
      form.reset(INITIAL_USER_FORM);
    }
  }, [open, form]);

  // Reset field kelas saat role berubah jadi ADMIN
  useEffect(() => {
    if (watchedRole === "ADMIN") {
      form.setValue("class", "");
    }
  }, [watchedRole, form]);

  const { mutateAsync: mutateCreateUser, isPending } = useMutation({
    mutationFn: (payload: UserPayload) => userService.createUser(payload),
  });

  const onSubmit = async (data: CreateUserForm) => {
    form.clearErrors("root");

    const payload: UserPayload = {
      name: data.name,
      nis: data.nis,
      role: data.role,
      email: data.email && data.email.trim() !== "" ? data.email : null,
      phone: data.phone && data.phone.trim() !== "" ? data.phone : null,
      password: data.password,
      class:
        data.role === "MEMBER" && data.class && data.class.trim() !== ""
          ? convertClassToRoman(data.class)
          : null,
    };

    toast.promise(
      mutateCreateUser(payload).then((res) => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_STATS] });
        handleChangeAction(false);
        form.reset();
        return res;
      }),
      {
        loading: "Menyimpan data pengguna...",
        success: "User berhasil ditambahkan!",
        error: (err) => {
          const isMapped = mapBackendErrorsToForm<CreateUserForm>(
            err,
            form.setError,
          );
          if (isMapped) {
            return "Gagal menyimpan: Periksa kembali form isian.";
          }
          return extractErrorMessage(err, "Gagal menambah user");
        },
      },
    );
  };

  const { isDirty } = form.formState;

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <DialogContent
        className="border-border/80 max-h-[90vh] overflow-y-auto shadow-2xl sm:max-w-md"
        onPointerDownOutside={(e) => {
          if (isDirty) {
            e.preventDefault();
            toast.warning("Formulir sedang diisi", {
              description:
                "Harap klik tombol Batal jika ingin membatalkan perubahan.",
            });
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Tambah Pengguna Baru
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Masukkan data pengguna baru. Semua kolom dengan tanda wajib harus
            diisi.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 py-2"
          noValidate
        >
          <FieldSet disabled={isPending}>
            <FieldGroup className="space-y-4">
              <FormInput
                form={form}
                name="name"
                label="Nama Lengkap"
                required
                placeholder="Masukkan nama lengkap"
                autoFocus
                disabled={isPending}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  form={form}
                  name="nis"
                  label="NIS"
                  placeholder="Masukkan nomor induk"
                  inputMode="numeric"
                  maxLength={20}
                  required
                  disabled={isPending}
                />

                <Controller
                  name="role"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="role" required>
                        Role / Peran
                      </FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        required
                        disabled={isPending}
                      >
                        <SelectTrigger id="role" className="w-full">
                          <SelectValue placeholder="Pilih Role..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MEMBER">
                            MEMBER (Anggota)
                          </SelectItem>
                          <SelectItem value="ADMIN">ADMIN (Petugas)</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              {/* Kelas — hanya tampil jika role = MEMBER */}
              {showClassField && (
                <FormInput
                  form={form}
                  name="class"
                  label="Kelas (opsional)"
                  placeholder="Contoh: 10 IPA 1"
                  maxLength={50}
                  disabled={isPending}
                />
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  form={form}
                  name="email"
                  label="Email (opsional)"
                  placeholder="nama@domain.com"
                  type="email"
                  maxLength={100}
                  disabled={isPending}
                />
                <FormInput
                  form={form}
                  name="phone"
                  label="Telepon (opsional)"
                  placeholder="0812xxxxxxxx"
                  inputMode="tel"
                  maxLength={15}
                  disabled={isPending}
                />
              </div>

              <FormPassword
                form={form}
                name="password"
                label="Kata Sandi"
                required
                placeholder="Minimal 6 karakter"
                maxLength={100}
                disabled={isPending}
              />
              {passwordValue &&
                passwordValue.length > 0 &&
                passwordValue.length < 6 && (
                  <p className="text-destructive animate-in fade-in flex items-center text-xs font-medium duration-200">
                    ⚠️ Sandi terlalu pendek (saat ini:{" "}
                    {passwordValue.length}/6 karakter)
                  </p>
                )}
            </FieldGroup>
          </FieldSet>

          {form.formState.errors.root && (
            <Alert variant="destructive" className="py-2">
              <AlertDescription className="w-full text-center text-xs font-semibold">
                {form.formState.errors.root.message}
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleChangeAction(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isPending} className="min-w-28">
              {isPending ? (
                <>
                  <Spinner className="mr-2" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Data"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
