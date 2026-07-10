"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/query-key.constants";
import { Button } from "@/components/ui/button";
import {
  Dialog,
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
import { Category } from "@/types/Category";
import { extractErrorMessage } from "@/lib/error-extractor";
import { mapBackendErrorsToForm } from "@/lib/form-helper";

interface DialogEditCategoryFormProps {
  currentData: Category | null;
  open: boolean;
  handleChangeAction: (open: boolean) => void;
}

export default function DialogEditCategoryForm({
  currentData,
  open,
  handleChangeAction,
}: DialogEditCategoryFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: INITIAL_CATEGORY_FORM,
  });

  useEffect(() => {
    if (open && currentData) {
      form.setValue("name", currentData.name);
      form.setValue("description", currentData.description ?? "");
    } else if (!open) {
      form.reset();
    }
  }, [open, currentData, form]);

  const { mutateAsync: mutateUpdateCategory, isPending } = useMutation({
    mutationFn: (payload: CategoryForm) =>
      categoryService.updateCategory(String(currentData?.id), payload),
  });

  const onSubmit = async (data: CategoryForm) => {
    form.clearErrors("root");
    
    toast.promise(
      mutateUpdateCategory(data).then((res) => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_STATS] });
        handleChangeAction(false);
        form.reset();
        return res;
      }),
      {
        loading: "Memperbarui kategori...",
        success: "Kategori berhasil diperbarui!",
        error: (err) => {
          const isMapped = mapBackendErrorsToForm<CategoryForm>(err, form.setError);
          if (isMapped) {
            return "Gagal memperbarui: Periksa kembali form isian.";
          }
          return extractErrorMessage(err, "Gagal memperbarui kategori");
        },
      }
    );
  };

  const isFormUnchanged = !form.formState.isDirty;

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Kategori</DialogTitle>
          <DialogDescription>
            Ubah data kategori melalui form berikut.
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
                disabled={isPending}
              />

              <FormInput
                form={form}
                name="description"
                label="Deskripsi"
                placeholder="Masukkan deskripsi"
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
            <Button type="submit" disabled={isPending || isFormUnchanged}>
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
    </Dialog>
  );
}
