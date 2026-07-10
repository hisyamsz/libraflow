"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/query-key.constants";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import FormInput from "@/components/common/form-input";
import {
  categorySchema,
  CategoryForm,
} from "@/validations/category.validation";
import { INITIAL_CATEGORY_FORM } from "@/constants/category.constants";
import categoryService from "@/services/category.service";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";
import { extractErrorMessage } from "@/lib/error-extractor";
import { mapBackendErrorsToForm } from "@/lib/form-helper";
import { Category } from "@/types/Category";

interface DialogAddCategoryFormProps {
  currentData?: Category | null;
  open: boolean;
  handleChangeAction: (open: boolean) => void;
}

export default function DialogAddCategoryForm({
  open,
  handleChangeAction,
}: DialogAddCategoryFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: INITIAL_CATEGORY_FORM,
  });

  const { mutateAsync: mutateAddCategory, isPending } = useMutation({
    mutationFn: (payload: CategoryForm) => categoryService.addCategory(payload),
  });

  const onSubmit = async (data: CategoryForm) => {
    form.clearErrors("root");
    
    toast.promise(
      mutateAddCategory(data).then((res) => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_STATS] });
        handleChangeAction(false);
        form.reset();
        return res;
      }),
      {
        loading: "Menyimpan kategori...",
        success: "Kategori berhasil ditambahkan!",
        error: (err) => {
          const isMapped = mapBackendErrorsToForm<CategoryForm>(err, form.setError);
          if (isMapped) {
            return "Gagal menyimpan: Periksa kembali form isian.";
          }
          return extractErrorMessage(err, "Gagal menambah kategori");
        },
      }
    );
  };

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Tambah Kategori</DialogTitle>
        <DialogDescription>
          Isi form berikut untuk menambahkan kategori baru.
        </DialogDescription>
      </DialogHeader>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <FieldSet disabled={isPending}>
          <FieldGroup>
            <FormInput
              form={form}
              name="name"
              label="Nama Kategori"
              placeholder="Masukkan nama kategori"
              autoFocus
              disabled={isPending}
            />

            <FormInput
              form={form}
              name="description"
              label="Deskripsi"
              placeholder="Masukkan deskripsi (opsional)"
              type="textarea"
              disabled={isPending}
            />
          </FieldGroup>
        </FieldSet>

        {form.formState.errors.root && (
          <p className="text-sm text-center text-red-500">
            {form.formState.errors.root.message}
          </p>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Batal
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Spinner />
                Menyimpan...
              </>
            ) : (
              "Simpan"
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
