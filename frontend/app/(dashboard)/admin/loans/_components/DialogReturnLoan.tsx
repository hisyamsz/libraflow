"use client";

import { useEffect } from "react";

import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/query-key.constants";

import loanService from "@/services/loan.service";
import { Loan } from "@/types/Loan";
import { extractErrorMessage } from "@/lib/error-extractor";
import { mapBackendErrorsToForm } from "@/lib/form-helper";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldSet,
  FieldGroup,
} from "@/components/ui/field";
import FormInput from "@/components/common/form-input";
import {
  returnLoanSchema,
  ReturnLoanForm,
} from "@/validations/loan.validation";
import { INITIAL_RETURN_LOAN_FORM } from "@/constants/loan.constants";

interface DialogReturnLoanProps {
  currentData: Loan | null;
  open: boolean;
  handleChangeAction: (open: boolean) => void;
}

export default function DialogReturnLoan({
  currentData,
  open,
  handleChangeAction,
}: DialogReturnLoanProps) {
  const queryClient = useQueryClient();

  const form = useForm<ReturnLoanForm>({
    resolver: zodResolver(returnLoanSchema),
    defaultValues: INITIAL_RETURN_LOAN_FORM,
  });

  const bookCondition = useWatch({
    control: form.control,
    name: "bookCondition",
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const { mutateAsync: handleReturn, isPending } = useMutation({
    mutationFn: (payload: { id: number; bookCondition: string; adminNote?: string }) =>
      loanService.returnLoan(payload.id, {
        bookCondition: payload.bookCondition,
        adminNote: payload.adminNote,
      }),
  });

  const onSubmit = (values: ReturnLoanForm) => {
    if (currentData) {
      toast.promise(
        handleReturn({
          id: currentData.id,
          bookCondition: values.bookCondition,
          adminNote: values.adminNote?.trim() || undefined,
        }).then((res) => {
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOANS] });
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_STATS] });
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MEMBER_STATS] });
          handleChangeAction(false);
          return res;
        }),
        {
          loading: "Memproses pengembalian...",
          success: (res) => res?.data?.meta?.message || "Buku berhasil dikembalikan!",
          error: (err) => {
            const isMapped = mapBackendErrorsToForm<ReturnLoanForm>(err, form.setError);
            if (isMapped) return "Gagal memproses: Periksa isian form.";
            return extractErrorMessage(err, "Gagal memproses pengembalian");
          },
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pengembalian Buku</DialogTitle>
          <DialogDescription>
            Buku: <strong className="text-foreground">{currentData?.book?.title}</strong>
            <br />
            Peminjam: <strong className="text-foreground">{currentData?.user?.name} (NIS: {currentData?.user?.nis ?? "-"})</strong>
            {currentData?.user?.class && (
              <>
                <br />
                Kelas: <strong className="text-foreground">{currentData.user.class}</strong>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldGroup className="py-2">
              <Controller
                name="bookCondition"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Kondisi Buku</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isPending}
                    >
                      <SelectTrigger id={field.name}>
                        <SelectValue placeholder="Pilih kondisi buku" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GOOD">Bagus / Lengkap</SelectItem>
                        <SelectItem value="DAMAGED">Rusak</SelectItem>
                        <SelectItem value="LOST">Hilang</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <FormInput
                form={form}
                name="adminNote"
                label={`Catatan Admin ${
                  bookCondition === "DAMAGED" || bookCondition === "LOST"
                    ? ""
                    : "(opsional)"
                }`}
                placeholder="Tambahkan catatan terkait kondisi fisik buku yang rusak atau hilang..."
                type="textarea"
                disabled={isPending}
                maxLength={500}
              />
            </FieldGroup>
          </FieldSet>

          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleChangeAction(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Menyimpan..." : "Simpan & Kembalikan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
