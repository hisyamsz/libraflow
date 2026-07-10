"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/query-key.constants";
import loanService from "@/services/loan.service";
import { Loan, LoanStatus } from "@/types/Loan";
import type { ApiResponse } from "@/types/Api";
import { extractErrorMessage } from "@/lib/error-extractor";
import { mapBackendErrorsToForm } from "@/lib/form-helper";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import FormInput from "@/components/common/form-input";
import { FieldSet, FieldGroup } from "@/components/ui/field";
import {
  rejectLoanSchema,
  RejectLoanForm,
} from "@/validations/loan.validation";
import { INITIAL_REJECT_LOAN_FORM } from "@/constants/loan.constants";

interface DialogRejectLoanProps {
  currentData: Loan | null;
  open: boolean;
  handleChangeAction: (open: boolean) => void;
}

export default function DialogRejectLoan({
  currentData,
  open,
  handleChangeAction,
}: DialogRejectLoanProps) {
  const queryClient = useQueryClient();
  const form = useForm<RejectLoanForm>({
    resolver: zodResolver(rejectLoanSchema),
    defaultValues: INITIAL_REJECT_LOAN_FORM,
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const { mutateAsync: rejectLoan, isPending } = useMutation({
    mutationFn: ({ id, adminNote }: { id: number; adminNote: string }) =>
      loanService.rejectLoan(id, adminNote),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ["loans"] });

      const previousQueries = queryClient.getQueriesData({
        queryKey: ["loans"],
      });

      queryClient.setQueriesData(
        { queryKey: ["loans"] },
        (old: ApiResponse<Loan[]> | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data?.map((loan: Loan) =>
              loan.id === id
                ? { ...loan, status: "REJECTED" as LoanStatus }
                : loan,
            ),
          };
        },
      );

      return { previousQueries };
    },
  });

  const handleConfirm = (values: RejectLoanForm) => {
    if (currentData) {
      toast.promise(
        rejectLoan({ id: currentData.id, adminNote: values.adminNote }).then(
          () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOANS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_STATS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MEMBER_STATS] });
            handleChangeAction(false);
          },
        ),
        {
          loading: "Memproses penolakan...",
          success: "Peminjaman berhasil ditolak.",
          error: (err) => {
            const isMapped = mapBackendErrorsToForm<RejectLoanForm>(
              err,
              form.setError,
            );
            if (isMapped) return "Gagal memproses: Periksa isian form.";
            return extractErrorMessage(err, "Gagal menolak peminjaman");
          },
        },
      );
    }
  };

  const handleCancel = () => {
    handleChangeAction(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleChangeAction}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tolak Peminjaman</AlertDialogTitle>
          <AlertDialogDescription>
            Masukkan alasan penolakan pengajuan peminjaman ini. Alasan akan
            disampaikan kepada anggota.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={form.handleSubmit(handleConfirm)}>
          <FieldSet>
            <FieldGroup className="py-4">
              <FormInput
                form={form}
                name="adminNote"
                label="Alasan Penolakan"
                placeholder="Contoh: Stok buku sedang tidak tersedia..."
                type="textarea"
                disabled={isPending}
                maxLength={500}
              />
            </FieldGroup>
          </FieldSet>

          <AlertDialogFooter>
            <AlertDialogCancel
              type="button"
              onClick={handleCancel}
              disabled={isPending}
            >
              Batal
            </AlertDialogCancel>
            <Button type="submit" variant="destructive" disabled={isPending}>
              {isPending ? "Memproses..." : "Tolak Peminjaman"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
