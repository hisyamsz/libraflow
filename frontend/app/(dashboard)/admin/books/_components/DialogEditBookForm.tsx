"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import {
  FieldGroup,
  FieldSet,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import FormInput from "@/components/common/form-input";
import {
  bookSchema,
  BookForm,
  BookPayload,
} from "@/validations/book.validation";
import bookService from "@/services/book.service";
import categoryService from "@/services/category.service";
import { Spinner } from "@/components/ui/spinner";
import { extractErrorMessage } from "@/lib/error-extractor";
import { mapBackendErrorsToForm } from "@/lib/form-helper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Book } from "@/types/Book";
import { Category } from "@/types/Category";

interface DialogEditBookFormProps {
  currentData: Book | null;
  open: boolean | undefined;
  handleChangeAction: (open: boolean) => void;
}

export default function DialogEditBookForm({
  currentData,
  open,
  handleChangeAction,
}: DialogEditBookFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<BookForm>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      author: "",
      publisher: "",
      year: "",
      isbn: "",
      description: "",
      stock: "1",
      coverImage: "",
      categoryId: 0,
    },
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories-select"],
    queryFn: async () => {
      const res = await categoryService.getAllCategories("limit=100&page=1");
      return res.data;
    },
    enabled: !!open,
  });

  const categories: Category[] = categoriesData?.data ?? [];

  useEffect(() => {
    if (open && currentData) {
      form.reset({
        title: currentData.title,
        author: currentData.author,
        publisher: currentData.publisher ?? "",
        year: currentData.year ? String(currentData.year) : "",
        isbn: currentData.isbn ?? "",
        description: currentData.description ?? "",
        stock: String(currentData.stock),
        coverImage: currentData.coverImage ?? "",
        categoryId: currentData.categoryId,
      });
    } else if (!open) {
      form.reset();
    }
  }, [open, currentData, form]);

  const { mutateAsync: mutateUpdateBook, isPending } = useMutation({
    mutationFn: (payload: BookPayload) =>
      bookService.updateBook(String(currentData?.id), payload),
  });

  const onSubmit = async (data: BookForm) => {
    form.clearErrors("root");
    const payload: BookPayload = {
      ...data,
      stock: Number(data.stock),
      year: data.year ? Number(data.year) : null,
      publisher: data.publisher || "",
      isbn: data.isbn || "",
      coverImage: data.coverImage || "",
      description: data.description || "",
    };
    
    toast.promise(
      mutateUpdateBook(payload).then((res) => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKS] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_STATS] });
        handleChangeAction(false);
        form.reset();
        return res;
      }),
      {
        loading: "Memperbarui buku...",
        success: "Buku berhasil diperbarui!",
        error: (err) => {
          const isMapped = mapBackendErrorsToForm<BookForm>(err, form.setError);
          if (isMapped) {
            return "Gagal memperbarui: Periksa kembali isian form yang ditandai merah.";
          }
          return extractErrorMessage(err, "Gagal memperbarui buku");
        },
      }
    );
  };

  const isFormUnchanged = !form.formState.isDirty;

  return (
    <Dialog open={!!open} onOpenChange={handleChangeAction}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Buku</DialogTitle>
          <DialogDescription>
            Ubah data buku melalui form berikut.
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
                name="title"
                label="Judul Buku"
                placeholder="Masukkan judul buku"
                disabled={isPending}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  form={form}
                  name="isbn"
                  label="ISBN (opsional)"
                  placeholder="Masukkan ISBN"
                  disabled={isPending}
                />
                <FormInput
                  form={form}
                  name="author"
                  label="Penulis"
                  placeholder="Masukkan nama penulis"
                  maxLength={150}
                  disabled={isPending}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  form={form}
                  name="publisher"
                  label="Penerbit (opsional)"
                  placeholder="Masukkan nama penerbit"
                  maxLength={150}
                  disabled={isPending}
                />
                <FormInput
                  form={form}
                  name="year"
                  label="Tahun Terbit (opsional)"
                  placeholder="Contoh: 2024"
                  type="number"
                  disabled={isPending}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  form={form}
                  name="stock"
                  label="Stok"
                  placeholder="Contoh: 10"
                  type="number"
                  min={0}
                  disabled={isPending}
                />
                <Controller
                  name="categoryId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="edit-categoryId">
                        Kategori
                      </FieldLabel>
                      <Select
                        onValueChange={(val) => field.onChange(Number(val))}
                        value={field.value ? String(field.value) : ""}
                        disabled={isPending}
                      >
                        <SelectTrigger id="edit-categoryId" className="w-full">
                          <SelectValue placeholder="Pilih kategori..." />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={String(cat.id)}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <FormInput
                form={form}
                name="coverImage"
                label="URL Cover (opsional)"
                placeholder="https://contoh.com/cover.jpg"
                disabled={isPending}
              />

              <FormInput
                form={form}
                name="description"
                label="Deskripsi (opsional)"
                placeholder="Masukkan deskripsi buku"
                type="textarea"
                maxLength={2000}
                disabled={isPending}
              />
            </FieldGroup>
          </FieldSet>

          {form.formState.errors.root && (
            <p className="text-center text-sm text-red-500">
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
