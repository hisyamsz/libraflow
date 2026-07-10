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
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { editUserSchema, EditUserForm } from "@/validations/user.validation";
import userService from "@/services/user.service";
import { User, UserPayload } from "@/types/User";
import { useAuth } from "@/hooks/use-auth";

interface DialogEditUserProps {
  currentData: User | null;
  open: boolean;
  handleChangeAction: (open: boolean) => void;
}

export default function DialogEditUser({
  currentData,
  open,
  handleChangeAction,
}: DialogEditUserProps) {
  const queryClient = useQueryClient();
  const { user: currentUser, update: updateSession } = useAuth();

  const isEditingSelf = currentData?.nis === currentUser?.nis;

  const form = useForm<EditUserForm>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: "",
      nis: "",
      role: "MEMBER",
      email: "",
      phone: "",
      class: "",
    },
  });

  const watchedRole = useWatch({ control: form.control, name: "role" });

  // Tampilkan field Kelas hanya jika role = MEMBER
  const showClassField = watchedRole === "MEMBER";

  // Isi default values saat form edit dibuka
  useEffect(() => {
    if (open && currentData) {
      form.reset({
        name: currentData.name,
        nis: currentData.nis,
        role: currentData.role,
        email: currentData.email || "",
        phone: currentData.phone || "",
        class: currentData.class || "",
      });
    }
  }, [open, currentData, form]);

  const { mutateAsync: mutateUpdateUser, isPending } = useMutation({
    mutationFn: (payload: UserPayload) => {
      if (!currentData) throw new Error("Tidak ada data user dipilih");
      return userService.updateUser(currentData.id, payload);
    },
  });

  const onSubmit = async (data: EditUserForm) => {
    form.clearErrors("root");

    const payload: UserPayload = {
      name: data.name,
      nis: data.nis,
      role: data.role,
      email: data.email && data.email.trim() !== "" ? data.email : null,
      phone: data.phone && data.phone.trim() !== "" ? data.phone : null,
      class:
        data.role === "MEMBER" && data.class && data.class.trim() !== ""
          ? convertClassToRoman(data.class)
          : null,
    };

    toast.promise(
      mutateUpdateUser(payload).then((res) => {
        if (isEditingSelf) {
          updateSession();
        }
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_STATS] });
        handleChangeAction(false);
        form.reset();
        return res;
      }),
      {
        loading: "Memperbarui data pengguna...",
        success: "User berhasil diperbarui!",
        error: (err) => {
          const isMapped = mapBackendErrorsToForm<EditUserForm>(
            err,
            form.setError,
          );
          if (isMapped) {
            return "Gagal memperbarui: Periksa kembali form isian.";
          }
          return extractErrorMessage(err, "Gagal memperbarui user");
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
            Edit Profil Pengguna
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Ubah data akun pengguna di bawah ini.
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
                  disabled={true}
                  inputMode="numeric"
                  required
                />

                <Controller
                  name="role"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="role-edit" required>
                        Role / Peran
                      </FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        required
                        disabled={isEditingSelf || isPending}
                      >
                        <SelectTrigger id="role-edit" className="w-full">
                          <SelectValue placeholder="Pilih Role..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MEMBER">
                            MEMBER (Anggota)
                          </SelectItem>
                          <SelectItem value="ADMIN">ADMIN (Petugas)</SelectItem>
                        </SelectContent>
                      </Select>
                      {isEditingSelf && (
                        <p className="text-muted-foreground mt-1 text-xs">
                          Anda tidak dapat mengubah peran Anda sendiri.
                        </p>
                      )}
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
            <Button
              type="submit"
              disabled={isPending || !isDirty}
              className="min-w-28"
            >
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
