"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import loanService from "@/services/loan.service";
import { Loan, LoanStatus } from "@/types/Loan";
import type { ApiResponse } from "@/types/Api";
import { extractErrorMessage } from "@/lib/error-extractor";
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
import { QUERY_KEYS } from "@/constants/query-key.constants";

interface DialogApproveLoanProps {
  currentData: Loan | null;
  open: boolean;
  handleChangeAction: (open: boolean) => void;
}

export default function DialogApproveLoan({
  currentData,
  open,
  handleChangeAction,
}: DialogApproveLoanProps) {
  const queryClient = useQueryClient();

  const { mutateAsync: approveLoan, isPending } = useMutation({
    mutationFn: (id: number) => loanService.approveLoan(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.LOANS] });

      const previousQueries = queryClient.getQueriesData({ queryKey: [QUERY_KEYS.LOANS] });

      queryClient.setQueriesData({ queryKey: [QUERY_KEYS.LOANS] }, (old: ApiResponse<Loan[]> | undefined) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data?.map((loan: Loan) =>
            loan.id === id ? { ...loan, status: "APPROVED" as LoanStatus } : loan
          ),
        };
      });

      return { previousQueries };
    },
    onError: (err, id, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, queryData]) => {
          queryClient.setQueryData(queryKey, queryData);
        });
      }
    },
  });

  const handleConfirm = () => {
    if (currentData) {
      toast.promise(
        approveLoan(currentData.id).then(() => {
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOANS] });
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_STATS] });
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MEMBER_STATS] });
          handleChangeAction(false);
        }),
        {
          loading: "Memproses persetujuan...",
          success: "Peminjaman berhasil disetujui.",
          error: (err) => extractErrorMessage(err, "Gagal menyetujui peminjaman"),
        }
      );
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleChangeAction}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Setujui Peminjaman</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini akan menyetujui peminjaman dan mengurangi stok buku. Lanjutkan?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            Batal
          </AlertDialogCancel>
          <Button disabled={isPending} onClick={handleConfirm}>
            {isPending ? "Memproses..." : "Ya, Setujui"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
