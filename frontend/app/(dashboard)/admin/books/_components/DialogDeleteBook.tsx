"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/query-key.constants";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import bookService from "@/services/book.service";
import { Spinner } from "@/components/ui/spinner";
import { Book } from "@/types/Book";
import { extractErrorMessage } from "@/lib/error-extractor";

interface DialogDeleteBookProps {
  currentData: Book | null;
  open: boolean | undefined;
  handleChangeAction: (open: boolean) => void;
}

export default function DialogDeleteBook({
  currentData,
  open,
  handleChangeAction,
}: DialogDeleteBookProps) {
  const queryClient = useQueryClient();

  const { mutateAsync: mutateDeleteBook, isPending } = useMutation({
    mutationFn: () => bookService.deleteBook(String(currentData?.id)),
  });

  return (
    <AlertDialog open={!!open} onOpenChange={handleChangeAction}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini akan menghapus buku{" "}
            <span className="font-semibold">&ldquo;{currentData?.title}&rdquo;</span>{" "}
            secara permanen dan tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              if (currentData?.id) {
                toast.promise(
                  mutateDeleteBook().then(() => {
                    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKS] });
                    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_STATS] });
                    handleChangeAction(false);
                  }),
                  {
                    loading: "Menghapus buku...",
                    success: "Buku berhasil dihapus!",
                    error: (err) => extractErrorMessage(err, "Gagal menghapus buku"),
                  }
                );
              }
            }}
            disabled={isPending}
            variant="destructive"
          >
            {isPending ? (
              <>
                <Spinner className="mr-2" />
                Menghapus...
              </>
            ) : (
              "Hapus"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
